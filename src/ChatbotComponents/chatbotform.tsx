"use client";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import TextareaAutosize from 'react-textarea-autosize';
import { FormField } from "@/components/ui/form";
import { ArrowUpIcon, Heart, MessageCircle, Sparkle } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
    value: z.string().min(1, "Message can't be less than 3 characters")
        .max(5000, "Message can't exceed 5000 characters"),
});

export const ChatbotForm = () => {
    const trpc = useTRPC();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { value: "" },
    });

    const [isFocused, setIsFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = useMutation(trpc.ResponseRouter.Response.mutationOptions({
        onSuccess: (data) => {
            console.log("Mutation onSuccess called with data:", data);
            toast.success(data.response);
            console.log("Response data:", data.response);
            form.reset();
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header Section */}
            <div className="text-center mb-8">


                <div className="flex items-center justify-center text-muted-foreground">
                    hi, there
                </div>

            </div>

            <FormProvider {...form}>
                <section className="space-y-6">
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className={cn(
                            "relative border p-4 pt-3 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                            isFocused && "shadow-xs"
                        )}
                    >
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <TextareaAutosize
                                    {...field}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    minRows={2}
                                    maxRows={8}
                                    className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                                    placeholder="How can I help you today?"
                                />
                                // {indication for typing in here }
                            )}
                        />

                        <div className="flex gap-x-2 items-end justify-between pt-2">
                            <div className="text-[10px] text-muted-foreground font-mono">
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                    <span>Enter</span> to Submit
                                </kbd>
                            </div>
                            <button
                                type="submit"
                                className="size-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary transition-all"
                            >
                                <ArrowUpIcon className="size-4" />
                            </button>
                        </div>
                    </form>
                </section>
            </FormProvider>
        </div>
    );
}; 