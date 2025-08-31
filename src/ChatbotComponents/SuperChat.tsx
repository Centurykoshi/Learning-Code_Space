"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ChatMessages from "./ChatbotPage";
import Chatbot from "./chatbotform";


interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

export default function ChatbotForm() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPending, setIsPending] = useState(false);

    const handleMessageSent = (userMessage: Message, assistantMessage: Message) => {
        // Add user message first, then set pending for assistant response
        setMessages(prev => [...prev, userMessage]);
        setIsPending(true);
        
        // Add assistant message after a brief delay to simulate typing
        setTimeout(() => {
            setMessages(prev => [...prev, assistantMessage]);
            setIsPending(false);
        }, 500);
    };

    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-background via-background  bg-red-400">
            <div className="max-w-4xl mx-auto p-6 bg-yellow-500">
                <motion.div
                    className="flex flex-col  bg-red-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
               
                    
                    <Chatbot 
                        onMessageSent={handleMessageSent} 
                        isPending={isPending}
                    />
                </motion.div>
                
            </div>
               
        </div>
        <div className="flex justify-center item-end bg-blue-200">
          <ChatMessages 
                        messages={messages} 
                        isTyping={isPending}
                    />

                    </div>
                    </>
        
    );
}