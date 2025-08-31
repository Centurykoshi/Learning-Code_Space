"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MarkdownRenderer } from "./MarkdownRender";
 // Import your existing AnimatedHeader
import { PulseWaveIndicator, WaveIndicator, TypewriterIndicator } from "./TypingIndicator"; // Import the new animations
import {
    AnimatedFormContainer,
    AnimatedTextarea,
    TypingIndicator,
    AnimatedBottomBar, 
    AnimatedHeader
} from "./ChatbotAnimations";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form";
import TextareaAutosize from 'react-textarea-autosize';
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

const formSchema = z.object({
    value: z.string().min(1, "Message can't be less than 3 characters")
        .max(5000, "Message can't exceed 5000 characters"),
});


const MessageDisplay = ({ messages, isTyping }: { messages: Message[], isTyping: boolean }) => {
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
                    <div className=" rounded-2xl px-4 py-3 ">
                     <WaveIndicator />
                        {/* Replace this with any of the animations above */}
                        {/* <PulseWaveIndicator /> */}
                        {/* Alternative options:
                        
                        <TypewriterIndicator />
                        <GradientFlowIndicator />
                        <BreathingIndicator />
                        <MorphingIndicator />
                        */}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// Main Chatbot Component
export default function ChatbotForm() {
    const trpc = useTRPC();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { value: "" },
    });

    const sendMessage = useMutation(trpc.ResponseRouter.Response.mutationOptions({
        onSuccess: (data, variables) => {
            console.log("Mutation onSuccess called with data:", data);
           
            // Add user message first
            const userMessage: Message = {
                id: `user-${Date.now()}`,
                content: variables.value,
                role: "user",
                timestamp: new Date(),
            };

            // Add assistant's response
            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                content: data.response,
                role: "assistant",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, userMessage, assistantMessage]);
            form.reset();
            setCharCount(0);
        },
        onError: (error) => {
            console.log("Mutation onError called with error:", error);
            toast.error("Failed to send message: " + error.message);
        }
    }));

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("handleSubmit called with data:", data);
        try {
            const result = await sendMessage.mutateAsync({ value: data.value });
            console.log("Mutation completed with result:", result);
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error: " + errorMessage);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isTyping && !sendMessage.isPending) {
                form.handleSubmit(handleSubmit)();
            }
        }
    };

    const watchedValue = form.watch("value");

    React.useEffect(() => {
        setCharCount(watchedValue?.length || 0);
        setIsTyping(watchedValue?.length > 0);
    }, [watchedValue]);

    const showHeader = messages.length === 0;

    return (
        <div className="w-full h-full flex flex-col  rounded-lg">
            <motion.div
                className="flex flex-col h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                    {/* Header Section - Use your existing AnimatedHeader */}
                

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
                        <FormProvider {...form}>
                            <AnimatedFormContainer isFocused={isFocused}>
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <TextareaAutosize
                                            {...field}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            onKeyDown={handleKeyDown}
                                            minRows={2}
                                            maxRows={8}
                                            className="w-full resize-none border-none bg-transparent text-foreground placeholder-muted-foreground/60 outline-none text-lg leading-relaxed"
                                            placeholder="Type your message here..."
                                        />
                                    )}
                                />

                                <TypingIndicator isTyping={isTyping} />

                                <AnimatedBottomBar
                                    charCount={charCount}
                                    isTyping={isTyping}
                                    isPending={sendMessage.isPending}
                                    onSubmit={form.handleSubmit(handleSubmit)}
                                />
                            </AnimatedFormContainer>
                        </FormProvider>
                    </div>
                </motion.div>
        </div>
    );
}