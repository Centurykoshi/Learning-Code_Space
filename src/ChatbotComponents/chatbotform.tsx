// components/ChatForm.tsx
"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form";
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from "sonner";
import {
    AnimatedFormContainer,
    TypingIndicator,
    AnimatedBottomBar,
} from "./ChatbotAnimations";

const formSchema = z.object({
    value: z.string().min(1, "Message can't be less than 3 characters")
        .max(5000, "Message can't exceed 5000 characters"),
});

interface ChatFormProps {
    isFocused: boolean;
    isTyping: boolean;
    charCount: number;
    isPending: boolean;
    currentConversationId?: string;
    onFocus: (focused: boolean) => void;
    onTypingChange: (typing: boolean) => void;
    onCharCountChange: (count: number) => void;
    onSubmit: (data: { value: string; conversationId?: string }) => Promise<void>;
}

export const ChatForm: React.FC<ChatFormProps> = ({
    isFocused,
    isTyping,
    charCount,
    isPending,
    currentConversationId,
    onFocus,
    onTypingChange,
    onCharCountChange,
    onSubmit,
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { value: "" },
    });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("handleSubmit called with data:", data);
        try {
            await onSubmit({
                value: data.value,
                conversationId: currentConversationId
            });
            form.reset();
            onCharCountChange(0);
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error: " + errorMessage);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isTyping && !isPending) {
                form.handleSubmit(handleSubmit)();
            }
        }
    };

    const watchedValue = form.watch("value");

    React.useEffect(() => {
        const length = watchedValue?.length || 0;
        onCharCountChange(length);
        onTypingChange(length > 0);
    }, [watchedValue, onCharCountChange, onTypingChange]);

    return (
        <FormProvider {...form}>
            <AnimatedFormContainer isFocused={isFocused}>
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            onFocus={() => onFocus(true)}
                            onBlur={() => onFocus(false)}
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
                    isPending={isPending}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </AnimatedFormContainer>
        </FormProvider>
    );
};