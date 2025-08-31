"use client";
import React from "react";
import { motion } from "framer-motion";
import { MessageDisplay, AnimatedHeader } from "./MessageDisplay";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

interface ChatMessagesProps {
    messages: Message[];
    isTyping?: boolean;
}

export default function ChatMessages({ messages, isTyping = false }: ChatMessagesProps) {
    const showHeader = messages.length === 0;

    return (
        <>
            {/* Header Section - Only show when no messages */}
            {showHeader && (
                <div className="flex-shrink-0">
                    <AnimatedHeader showHeader={showHeader} />
                </div>
            )}

            {/* Messages Section */}
            <motion.div
                className="flex-1 overflow-hidden"
                layout
            >
                {messages.length > 0 && (
                    <motion.div
                        className="h-full bg-red-700 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent px-4 py-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <MessageDisplay
                            messages={messages}
                            isTyping={isTyping}
                        />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}