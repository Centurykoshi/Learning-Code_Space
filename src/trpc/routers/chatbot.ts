// trpc/routers/chatbot.ts - Chatbot-specific TRPC routes
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import {
    calculateImportanceScore,
    updateConversationMemory
} from "@/lib/memory-utils";

export const chatbotRouter = createTRPCRouter({
    // Send message to chatbot
    sendMessage: baseProcedure
        .input(z.object({
            value: z.string()
                .min(1, "Message can't be less than 3 characters or empty")
                .max(5000, "Message can't exceed 5000 characters"),
            conversationId: z.string().optional()
        }))
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to respond.',
                });
            }

            let conversationId = input.conversationId;
            let conversation;

            try {
                // If no conversationId provided, create a new conversation
                if (!conversationId) {
                    conversation = await prisma.chatbotConversation.create({
                        data: {
                            userId: userId,
                            title: input.value.substring(0, 50) + (input.value.length > 50 ? "..." : ""), // Use first 50 chars as title
                        }
                    });
                    conversationId = conversation.id;
                } else {
                    // Verify the conversation exists and belongs to the user
                    conversation = await prisma.chatbotConversation.findFirst({
                        where: {
                            id: conversationId,
                            userId: userId
                        }
                    });

                    if (!conversation) {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: 'Conversation not found or you do not have access to it.',
                        });
                    }
                }

                // Get conversation history and memory for context
                const conversationWithHistory = await prisma.chatbotConversation.findFirst({
                    where: {
                        id: conversationId,
                        userId: userId
                    },
                    include: {
                        messages: {
                            orderBy: {
                                createdAt: 'asc'
                            },
                            take: 20 // Get last 20 messages for context
                        }
                    }
                });

                // Calculate importance score for the user message (1-10 scale)
                const importanceScore = calculateImportanceScore(input.value);

                // Save user message to database with importance
                const userMessage = await prisma.chatbotMessage.create({
                    data: {
                        conversationId: conversationId,
                        content: input.value,
                        sender: 'USER',
                        importance: importanceScore,
                        tokenCount: input.value.split(' ').length
                    }
                });

                // Generate AI response with memory context
                const response = await generateText(userId, input.value, conversationWithHistory);

                // Save AI response to database
                const aiMessage = await prisma.chatbotMessage.create({
                    data: {
                        conversationId: conversationId,
                        content: response,
                        sender: 'BOT',
                        tokenCount: response.split(' ').length
                    }
                });

                // Update conversation memory and summary
                await updateConversationMemory(conversationId, conversationWithHistory?.messages || [], input.value, response);

                // Update conversation's updatedAt timestamp
                await prisma.chatbotConversation.update({
                    where: { id: conversationId },
                    data: { updatedAt: new Date() }
                });

                return {
                    response,
                    conversationId,
                    userMessageId: userMessage.id,
                    aiMessageId: aiMessage.id
                };

            } catch (error) {
                console.error('Error in sendMessage mutation:', error);

                if (error instanceof TRPCError) {
                    throw error;
                }

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to process your message. Please try again.',
                });
            }
        }),

    // Get conversation by ID
    getConversation: baseProcedure
        .input(z.object({
            conversationId: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to view conversations.',
                });
            }

            const conversation = await prisma.chatbotConversation.findFirst({
                where: {
                    id: input.conversationId,
                    userId: userId
                },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }
                }
            });

            if (!conversation) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Conversation not found.',
                });
            }

            return conversation;
        }),

    // Get all conversations for a user
    getUserConversations: baseProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to view conversations.',
                });
            }

            const conversations = await prisma.chatbotConversation.findMany({
                where: {
                    userId: userId
                },
                include: {
                    messages: {
                        take: 1,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    _count: {
                        select: { messages: true }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });

            return conversations;
        }),

    // Delete a conversation
    deleteConversation: baseProcedure
        .input(z.object({
            conversationId: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to delete conversations.',
                });
            }

            // Verify the conversation exists and belongs to the user
            const conversation = await prisma.chatbotConversation.findFirst({
                where: {
                    id: input.conversationId,
                    userId: userId
                }
            });

            if (!conversation) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Conversation not found or you do not have access to it.',
                });
            }

            // Delete the conversation (messages will be deleted due to cascade)
            await prisma.chatbotConversation.delete({
                where: { id: input.conversationId }
            });

            return { success: true };
        }),

    // Update conversation title
    updateConversationTitle: baseProcedure
        .input(z.object({
            conversationId: z.string(),
            title: z.string().min(1).max(100)
        }))
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to update conversations.',
                });
            }

            // Verify the conversation exists and belongs to the user
            const conversation = await prisma.chatbotConversation.findFirst({
                where: {
                    id: input.conversationId,
                    userId: userId
                }
            });

            if (!conversation) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Conversation not found or you do not have access to it.',
                });
            }

            // Update the conversation title
            const updatedConversation = await prisma.chatbotConversation.update({
                where: { id: input.conversationId },
                data: {
                    title: input.title,
                    updatedAt: new Date()
                }
            });

            return updatedConversation;
        })
});
