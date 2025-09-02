// components/ChatbotForm.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { AnimatedHeader } from "./ChatbotAnimations";
import { useConversation } from "@/hooks/useConversation";
import { MessageDisplay } from "./MessasgeDisplay";
import { ChatForm } from "./chatbotform";
import { ChatbotFormProps } from "@/types/types";

// Conversation ID Display Component
const ConversationIdDisplay = ({ conversationId }: { conversationId?: string }) => {
    console.log("ConversationIdDisplay rendered with:", conversationId);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-2 border-b border-border/20 bg-muted/20"
        >
            <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    {conversationId ? (
                        <>
                            Conversation ID:
                            <span className="ml-2 font-mono text-xs bg-muted/50 px-2 py-1 rounded">
                                {conversationId}
                            </span>
                        </>
                    ) : (
                        <span className="text-muted-foreground/50">
                            New Conversation - ID will appear after first message
                        </span>
                    )}
                </div>
                <div className="text-xs text-green-500">
                    ● {conversationId ? 'Active' : 'Ready'}
                </div>
            </div>
        </motion.div>
    );
};

export default function ChatbotForm({ chat, conversationId }: ChatbotFormProps) {
    const {
        messages,
        currentConversationId,
        isTyping,
        isFocused,
        charCount,
        sendMessage,
        setIsFocused,
        setCharCount,
        setIsTyping,
    } = useConversation({ chat, conversationId });

    const handleSubmit = async (data: { value: string; conversationId?: string }) => {
        console.log("handleSubmit called with data:", data);
        const result = await sendMessage.mutateAsync(data);
        console.log("Mutation completed with result:", result);
        return result;
    };

    const showHeader = messages.length === 0;
    const displayConversationId = currentConversationId || conversationId;

    return (
        <div className="w-full h-full flex flex-col rounded-lg border border-border/20 bg-background/50 backdrop-blur-sm">
            {/* Conversation ID Display */}
            <ConversationIdDisplay conversationId={displayConversationId} />

            <motion.div
                className="flex flex-col h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                {/* Messages Section */}
                <motion.div
                    className="flex-1 overflow-hidden flex flex-col min-h-0"
                    layout
                >
                    {messages.length > 0 ? (
                        <motion.div
                            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="px-6 py-4 min-h-full">
                                <MessageDisplay
                                    messages={messages}
                                    isTyping={sendMessage.isPending}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1"></div>
                    )}
                </motion.div>

                {/* Form Section */}
                <div className="flex-shrink-0 bg-transparent">
                    {showHeader && (
                        <div className="flex-shrink-0">
                            <AnimatedHeader />
                        </div>
                    )}

                    <ChatForm
                        isFocused={isFocused}
                        isTyping={isTyping}
                        charCount={charCount}
                        isPending={sendMessage.isPending}
                        currentConversationId={currentConversationId}
                        onFocus={setIsFocused}
                        onTypingChange={setIsTyping}
                        onCharCountChange={setCharCount}
                        onSubmit={handleSubmit}
                    />
                </div>
            </motion.div>
        </div>
    );
}