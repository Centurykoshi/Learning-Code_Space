// components/MessageDisplay.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

import { WaveIndicator } from "./TypingIndicator";
import { Message } from "@/types/types";
import { MarkdownRenderer } from "./MarkdownRender";

interface MessageDisplayProps {
    messages: Message[];
    isTyping: boolean;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages, isTyping }) => {
    return (
        <div className="space-y-6 pb-4">
            {messages.map((message, index) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.2,
                        delay: index * 0.02,
                        ease: "easeOut"
                    }}
                    className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`
                            max-w-[85%] px-3 py-2
                            ${message.role === "user"
                                ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm"
                                : "text-foreground"
                            }
                        `}
                    >
                        {message.role === "assistant" ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <MarkdownRenderer
                                    content={message.content}
                                    className="text-sm"
                                />
                            </motion.div>
                        ) : (
                            <p className="text-sm leading-relaxed font-medium">
                                {message.content}
                            </p>
                        )}

                        <div className={`
                            text-xs mt-2 opacity-50
                            ${message.role === "user" ? "text-right" : "text-left text-muted-foreground"}
                        `}>
                            {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                </motion.div>
            ))}
            

            {/* Typing indicator */}
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-start"
                >
                    <div className="px-3 py-2">
                        <WaveIndicator />
                    </div>
                </motion.div>
            )}
        </div>
    );
};