"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    AnimatedFormContainer,
    AnimatedTextarea,
    TypingIndicator,
    AnimatedBottomBar
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

interface ChatFormProps {
    onMessageSent: (userMessage: Message, assistantMessage: Message) => void;
}

const formSchema = z.object({
    value: z.string().min(1, "Message can't be less than 3 characters")
        .max(5000, "Message can't exceed 5000 characters"),
});

interface ChatFormProps {
    onMessageSent: (userMessage: Message, assistantMessage: Message) => void;
    isPending?: boolean;
}

export default function Chatbot({ onMessageSent, isPending = false }: ChatFormProps) {
    const trpc = useTRPC();
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
           
            // Create user message
            const userMessage: Message = {
                id: `user-${Date.now()}`,
                content: variables.value,
                role: "user",
                timestamp: new Date(),
            };

            // Create assistant message
            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                content: data.response,
                role: "assistant",
                timestamp: new Date(),
            };

            // Pass both messages to parent component
            onMessageSent(userMessage, assistantMessage);

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
            if (isTyping && !sendMessage.isPending && !isPending) {
                form.handleSubmit(handleSubmit)();
            }
        }
    };

    const watchedValue = form.watch("value");

    React.useEffect(() => {
        setCharCount(watchedValue?.length || 0);
        setIsTyping(watchedValue?.length > 0);
    }, [watchedValue]);

    return (
        <div className="flex-shrink-0 items-end justify-center ">
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
                        isPending={sendMessage.isPending || isPending}
                        onSubmit={form.handleSubmit(handleSubmit)}
                    />
                </AnimatedFormContainer>
            </FormProvider>
        </div>
    );
}