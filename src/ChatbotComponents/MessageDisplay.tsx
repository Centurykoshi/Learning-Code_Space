import React from "react";
import { motion } from "framer-motion";
import { MarkdownRenderer } from "./MarkdownRender";


interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

interface MessageDisplayProps {
    messages: Message[];
    isTyping?: boolean;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ 
    messages, 
    isTyping = false 
}) => {
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
                    className={`flex w-full ${
                        message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                        className={`
                            max-w-[85%] rounded-2xl px-4 py-3 shadow-sm
                            ${message.role === "user" 
                                ? "bg-primary text-primary-foreground ml-auto" 
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
            
            {/* Typing indicator */}
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                >
                    <div className="bg-muted/50 rounded-2xl px-4 py-3 border border-border/50">
                        <div className="flex space-x-1">
                            <motion.div
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// Simple animated header component
export const AnimatedHeader: React.FC<{ showHeader: boolean }> = ({ showHeader }) => {
    if (!showHeader) return null;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center py-8 mb-6"
        >
            <motion.h1 
                className="text-4xl font-bold text-foreground mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              
            </motion.h1>
            <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto bg-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                Hi There How can I help you today 
            </motion.p>
        </motion.div>
    );
};