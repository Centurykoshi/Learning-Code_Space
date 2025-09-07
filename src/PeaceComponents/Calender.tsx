"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverTrigger, Popover } from "@/components/ui/popover";
import { useTRPC } from "@/trpc/client";
import { PopoverContent } from "@radix-ui/react-popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ComponentProps, useRef, useState } from "react";
import { toast } from "sonner";

export default function CalenderWork() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);
    const [mood, setMood] = useState<{ [key: string]: Mood }>({});
    const [options, setoptions] = useState(false);
    const [usedColor, setUsedColor] = useState<Set<string>>(new Set());

    const canvasRef = useRef<HTMLCanvasElement>(null);

    type Mood = keyof typeof moods;

    const trpc = useTRPC();

    const moods = {
        happy: "bg-yellow-400 text-black",
        sad: "bg-blue-500 text-white",
        angry: "bg-red-500 text-white",
        relaxed: "bg-green-500 text-white",
        anxious: "bg-purple-500 text-white",
    } as const;

    const Save_Mood_Mutation = useMutation(trpc.moodRespone.SaveMood.mutationOptions({
        onSuccess: () => {
            toast.success("Mood saved to the database");
        },
    }))

    const { data: allMoods, isLoading, error } = useQuery(trpc.moodRespone.getAllMood.queryOptions());

    // Helper function to format date consistently
    const formatDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Helper function to parse date key back to Date object
    const parseDateKey = (dateKey: string): Date => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed
    };

    const handlemoodSelection = (mood: Mood) => {
        if (!date) return;

        const key = formatDateKey(date);

        setMood((prev) => ({
            ...prev,
            [key]: mood,
        }));
        setOpen(false);
    }

    const modifiers: Record<Mood, Date[]> = {
        happy: [],
        sad: [],
        angry: [],
        relaxed: [],
        anxious: [],
    }

    for (const dateString of Object.keys(mood)) {
        const moodType = mood[dateString];
        const localDate = parseDateKey(dateString);
        modifiers[moodType].push(localDate);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDateDisabled = (date: Date) => {
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate > today;
    }

    const handledateSelect = (date: Date | undefined) => {
        if (date && !isDateDisabled(date)) {
            setDate(date);
            setoptions(true);
            setUsedColor(new Set());
        }
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col gap-4">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => {
                                    if (date) {
                                        setDate(date);
                                        setOpen(true);
                                    }
                                }}
                                className="rounded-2xl border bg-transparent shadow-sm"
                                defaultMonth={date}
                                captionLayout="dropdown"
                                modifiers={modifiers}
                                modifiersClassNames={moods}
                                disabled={isDateDisabled}
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2 space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Select your Mood for {date?.toLocaleDateString()}
                        </p>
                        <div className="flex flex-col gap-2">
                            {(Object.keys(moods) as Mood[]).map((mood) => (
                                <Button
                                    key={mood}
                                    onClick={() => handlemoodSelection(mood)}
                                    className={`${moods[mood]} w-full`}
                                >
                                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
