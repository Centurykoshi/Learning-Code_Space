"use client"; 
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
// import TextareaAutosize from 'react-textarea-autosize';

import { FormField } from "@/components/ui/form";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";


const formSchema = z.object({
    value: z.string().min(3, "Message can't be less than 3 or empty ")
        .max(5000, "Message can't exceed 5000 characters"),
});


export const ChatbotForm = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const QueryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { value: "" },
    })
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = async () => {

    }


    return (
        <FormProvider {...form}>
            <section className="space-y-6">
                <form onSubmit={() => ({})}
                    className={cn("relative border p-4 pt-3 rounded-xl bg-sidebar  dark:bg-sidebar transition-all",
                        isFocused && "shadow-xs"
                    )}>
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <TextareaAutosize {...field}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                minRows={2}
                                maxRows={8}
                                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                                placeholder="what would you like to build"
                            />
                        )}
                    />

                    <div className="flex gap-x-2 items-end justify-between pt-2">
                        <div className="text-[10px] text-muted-foreground font-mono">
                            <kbd className="ml-auto pointer-events-none inline-flex h-5
                                select-none items-center gap-1 border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                <span>&nbsp;to Submit </span> Enter </kbd>

                        </div>
                        <button className="size-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary transition all">

                        <ArrowUpIcon className=" size-4 " />
                        </button>

                    </div>

                </form>
            </section>

        </FormProvider>
    )

}; 