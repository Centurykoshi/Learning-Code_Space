// hooks/useConversation.ts - Alternative approach with direct TRPC hooks
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client"; // Fixed import
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

interface ConversationState {
    messages: Message[];
    currentConversationId?: string;
    isTyping: boolean;
    isFocused: boolean;
    charCount: number;
}

interface UseConversationProps {
    chat?: any;
    conversationId?: string;
}

interface UseConversationReturn extends ConversationState {
    sendMessage: any; // We'll let TypeScript infer this
    addUserMessage: (content: string) => void;
    initializeFromChat: (chat: any) => void;
    setIsFocused: (focused: boolean) => void;
    setCharCount: (count: number) => void;
    setIsTyping: (typing: boolean) => void;
}

export function useConversation({
    chat,
    conversationId
}: UseConversationProps): UseConversationReturn {

    const trpc = useTRPC();
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const router = useRouter();

    // Use new chatbot TRPC mutation
    const sendMessage = useMutation(trpc.chatbot.sendMessage.mutationOptions({
        onMutate: async (variables: { value: string; conversationId?: string }) => {
            // Optimistically add the user message immediately
            const userMessage: Message = {
                id: `temp-user-${Date.now()}`,
                content: variables.value,
                role: "user",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, userMessage]);
            return { userMessage };
        },
        onSuccess: (data: { response: string; conversationId: string }, variables: { value: string; conversationId?: string }, context: any) => {
     

            // Update conversation ID if it's new and show it in the UI
            if (data.conversationId && !currentConversationId) {
                setCurrentConversationId(data.conversationId);
               

                // Update the URL without any navigation using browser history API
                // Correct path for your folder structure
                window.history.replaceState(null, '', `/Chatbot/chat/${data.conversationId}`);

            }

            // Replace the temporary user message with the real one and add assistant response
            setMessages(prev => {
                // Remove the temporary message and add both real messages
                const withoutTemp = prev.filter(msg => !msg.id.startsWith('temp-user-'));

                const userMessage: Message = {
                    id: `user-${Date.now()}`,
                    content: variables.value,
                    role: "user",
                    timestamp: new Date(),
                };

                const assistantMessage: Message = {
                    id: `assistant-${Date.now()}`,
                    content: data.response,
                    role: "assistant",
                    timestamp: new Date(),
                };

                return [...withoutTemp, userMessage, assistantMessage];
            });
        },
        onError: (error: any, variables: { value: string; conversationId?: string }, context: any) => {
           

            // Remove the optimistic user message on error
            setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-user-')));

            toast.error("Failed to send message: " + error.message);
        }
    }));

    // Removed the query part since we don't have proper TRPC query setup
    // Will use the chat prop passed from the page instead

    // Debug: Log messages state changes
    useEffect(() => {
        console.log("Messages state updated:", messages);
    }, [messages]);

    // Initialize messages from existing chat
    const initializeFromChat = (chatData: any) => {
        if (chatData && chatData.messages) {
            const formattedMessages: Message[] = chatData.messages.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                role: msg.sender === 'USER' ? 'user' : 'assistant',
                timestamp: new Date(msg.createdAt),
            }));
            setMessages(formattedMessages);
        }
    };

    useEffect(() => {
        if (chat) {
            // Initialize from provided chat data
            initializeFromChat(chat);
        }
    }, [chat, conversationId]);

    const addUserMessage = (content: string) => {
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content,
            role: "user",
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
    };

    return {
        messages,
        currentConversationId,
        isTyping,
        isFocused,
        charCount,
        sendMessage,
        addUserMessage,
        initializeFromChat,
        setIsFocused,
        setCharCount,
        setIsTyping,
    };
}