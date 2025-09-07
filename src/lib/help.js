"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverTrigger, Popover } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { ComponentProps, useRef, useState } from "react";
import { trpc } from "@/trpc/client"; // Adjust import path as needed
import { toast } from "sonner"; // Or your preferred toast library

export default function CalenderWork() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);
    const [options, setoptions] = useState(false);
    const [usedColor, setUsedColor] = useState<Set<string>>(new Set());

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Updated to match your backend schema
    type Mood = keyof typeof moods;

    const moods = {
        good: "bg-green-400 text-black",
        bad: "bg-red-400 text-white", 
        great: "bg-green-600 text-white",
        okay: "bg-yellow-400 text-black",
        horrible: "bg-red-700 text-white",
    } as const;

    // tRPC hooks
    const saveMoodMutation = trpc.MoodTrackerRouter.SaveMood.useMutation({
        onSuccess: () => {
            toast.success("Mood saved successfully!");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const { data: allMoods } = trpc.MoodTrackerRouter.getAll.useQuery();

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

    const handlemoodSelection = async (selectedMood: Mood) => {
        if (!date) return;

        const key = formatDateKey(date);

        try {
            // Save to backend - tRPC will auto-refetch the query
            await saveMoodMutation.mutateAsync({
                date: key,
                mood: selectedMood,
            });

            setOpen(false);
        } catch (error) {
            console.error("Failed to save mood:", error);
        }
    }

    const modifiers: Record<Mood, Date[]> = {
        good: [],
        bad: [],
        great: [],
        okay: [],
        horrible: [],
    }

    // Use data directly from tRPC query instead of local state
    if (allMoods) {
        allMoods.forEach((moodEntry) => {
            const moodType = moodEntry.mood as Mood;
            const localDate = parseDateKey(moodEntry.date);
            modifiers[moodType].push(localDate);
        });
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
                            {(Object.keys(moods) as Mood[]).map((moodOption) => (
                                <Button
                                    key={moodOption}
                                    onClick={() => handlemoodSelection(moodOption)}
                                    className={`${moods[moodOption]} w-full`}
                                    disabled={saveMoodMutation.isPending}
                                >
                                    {saveMoodMutation.isPending ? 
                                        "Saving..." : 
                                        moodOption.charAt(0).toUpperCase() + moodOption.slice(1)
                                    }
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}