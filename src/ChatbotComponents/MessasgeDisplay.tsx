// components/MessageDisplay.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { MarkdownRenderer } from "./MarkdownRender";
import { WaveIndicator } from "./TypingIndicator";
import { Message } from "@/types/types";




interface MessageDisplayProps {
    messages : Message[]; 
    isTyping: boolean;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages, isTyping }) => {
    return (
        <div className="space-y-6 pb-4">
            {messages.map((message, index) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "easeOut"
                    }}
                    className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                >
                    <div
                        className={`
                            max-w-[85%] rounded-2xl px-4 py-3 shadow-sm
                            ${message.role === "user"
                                ? "bg-primary/20 text-secondary-foreground ml-auto "
                                : "bg-muted/50 text-foreground mr-auto border border-border/50"
                            }
                        `}
                    >
                        {message.role === "assistant" ? (
                            <MarkdownRenderer
                                content={message.content}
                                className="text-sm"
                            />
                        ) : (
                            <p className="text-sm leading-relaxed">
                                {message.content}
                            </p>
                        )}

                        <div className={`
                            text-xs mt-2 opacity-60
                            ${message.role === "user" ? "text-right" : "text-left"}
                        `}>
                            {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Typing indicator with better animation */}
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                >
                    <div className="rounded-2xl px-4 py-3">
                        <WaveIndicator />
                    </div>
                </motion.div>
            )}
        </div>
    );
};