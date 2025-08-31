"use client"; 
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form";
import { ArrowUp, Sparkles, Heart, MessageCircle } from "lucide-react";
import TextareaAutosize from 'react-textarea-autosize';

const formSchema = z.object({
    value: z.string().min(3, "Message can't be less than 3 or empty ")
        .max(5000, "Message can't exceed 5000 characters"),
});

export const ChatbotForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { value: "" },
    });
    
    const [isFocused, setIsFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const handleSubmit = async () => {
        // Your tRPC logic will go here
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Heart className="size-6" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Dr. Maya
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Your compassionate mental health companion
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                        Available 24/7
                    </div>
                    <div className="flex items-center gap-1">
                        <Sparkles className="size-4" />
                        Personalized responses
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="size-4" />
                        Safe & confidential
                    </div>
                </div>
            </div>

            <FormProvider {...form}>
                <section className="space-y-6">
                    <div className="relative">
                        {/* Gradient border wrapper */}
                        <div className={cn(
                            "absolute inset-0 rounded-2xl transition-all duration-300",
                            isFocused 
                                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px]" 
                                : "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 p-[1px]"
                        )}>
                            <div className="h-full w-full rounded-2xl bg-white dark:bg-gray-900" />
                        </div>

                        <form 
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 transition-all duration-300"
                        >
                            {/* Chat input area */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <div className="relative">
                                            <TextareaAutosize 
                                                {...field}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setIsFocused(false)}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setIsTyping(e.target.value.length > 0);
                                                }}
                                                minRows={3}
                                                maxRows={8}
                                                className={cn(
                                                    "w-full resize-none border-none outline-none bg-transparent text-lg",
                                                    "placeholder:text-muted-foreground/60",
                                                    "transition-all duration-200"
                                                )}
                                                placeholder="Share what's on your mind... I'm here to listen and help 💙"
                                            />
                                            
                                            {/* Typing indicator */}
                                            {isTyping && (
                                                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-muted-foreground">
                                                    <div className="flex gap-1">
                                                        <div className="size-1 rounded-full bg-blue-500 animate-bounce"></div>
                                                        <div className="size-1 rounded-full bg-purple-500 animate-bounce [animation-delay:0.1s]"></div>
                                                        <div className="size-1 rounded-full bg-pink-500 animate-bounce [animation-delay:0.2s]"></div>
                                                    </div>
                                                    <span>Dr. Maya is ready to respond</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />

                                {/* Bottom section */}
                                <div className="flex items-center justify-between">
                                    {/* Character count and shortcut */}
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <kbd className="px-2 py-1 rounded bg-muted border text-xs font-mono">
                                                Shift + Enter
                                            </kbd>
                                            <span>for new line</span>
                                        </div>
                                        <div className={cn(
                                            "transition-colors",
                                            form.watch("value")?.length > 4500 && "text-orange-500",
                                            form.watch("value")?.length > 4800 && "text-red-500"
                                        )}>
                                            {form.watch("value")?.length || 0} / 5000
                                        </div>
                                    </div>

                                    {/* Submit button */}
                                    <button 
                                        type="submit"
                                        disabled={!form.formState.isValid || !form.watch("value")?.trim()}
                                        className={cn(
                                            "relative overflow-hidden group",
                                            "size-12 rounded-xl flex items-center justify-center",
                                            "transition-all duration-300 transform",
                                            "disabled:opacity-50 disabled:cursor-not-allowed",
                                            form.formState.isValid && form.watch("value")?.trim()
                                                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105" 
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                        )}
                                    >
                                        {/* Button background animation */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                        
                                        {/* Icon */}
                                        <ArrowUp className={cn(
                                            "size-5 transition-all duration-200",
                                            form.formState.isValid && form.watch("value")?.trim() && "group-hover:scale-110"
                                        )} />

                                        {/* Ripple effect on hover */}
                                        <div className="absolute inset-0 rounded-xl border-2 border-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>

                            {/* Form errors */}
                            {form.formState.errors.value && (
                                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {form.formState.errors.value.message}
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Helpful tips */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💭 Share Freely</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Express your thoughts and feelings without judgment</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
                            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎯 Get Guidance</h3>
                            <p className="text-sm text-purple-700 dark:text-purple-300">Receive personalized advice and coping strategies</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">🌱 Grow Together</h3>
                            <p className="text-sm text-green-700 dark:text-green-300">Build resilience and emotional well-being</p>
                        </div>
                    </div>
                </section>
            </FormProvider>
        </div>
    );
};