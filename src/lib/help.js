"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Mood = keyof typeof moods;

const moods = {
    happy: "bg-yellow-400 text-black",
    sad: "bg-blue-500 text-white",
    angry: "bg-red-500 text-white",
    relaxed: "bg-green-500 text-white",
    anxious: "bg-purple-500 text-white",
} as const;

export default function CalendarWork() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);
    const [mood, setMood] = useState<{ [key: string]: Mood }>({});

    const trpc = useTRPC();

    const saveMoodMutation = useMutation(trpc.moodRespone.SaveMood.mutationOptions({
        onSuccess: () => {
            toast.success("Mood saved to the database");
        },
        onError: () => {
            toast.error("Failed to save mood");
        }
    }));

    const { data: allMoods, isLoading, error } = useQuery(trpc.moodRespone.getAllMood.queryOptions());

    // Load existing moods when data is available
    useEffect(() => {
        if (allMoods) {
            const moodMap: { [key: string]: Mood } = {};
            allMoods.forEach((moodEntry: any) => {
                // The backend returns date as string in YYYY-MM-DD format
                moodMap[moodEntry.date] = moodEntry.mood;
            });
            setMood(moodMap);
        }
    }, [allMoods]);

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
        return new Date(year, month - 1, day);
    };

    const handleMoodSelection = async (selectedMood: Mood) => {
        if (!date) return;

        const key = formatDateKey(date);

        // Update local state immediately for better UX
        setMood((prev) => ({
            ...prev,
            [key]: selectedMood,
        }));

        // Save to database
        try {
            // Option 1: If your backend expects a string
            await saveMoodMutation.mutateAsync({
                date: key,
                mood: selectedMood as string
            });

            // Option 2: If your backend expects the mood as a different field name
            // await saveMoodMutation.mutateAsync({
            //     date: date.toISOString(),
            //     moodType: selectedMood
            // });

            // Option 3: If you need to map the mood to a different format
            // await saveMoodMutation.mutateAsync({
            //     date: key, // or date.toISOString()
            //     mood: selectedMood.toUpperCase() // or some other transformation
            // });
        } catch (error) {
            // Revert local state if save fails
            setMood((prev) => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            });
        }

        setOpen(false);
    };

    // Build modifiers for calendar styling
    const modifiers: Record<Mood, Date[]> = {
        happy: [],
        sad: [],
        angry: [],
        relaxed: [],
        anxious: [],
    };

    Object.entries(mood).forEach(([dateString, moodType]) => {
        const localDate = parseDateKey(dateString);
        modifiers[moodType].push(localDate);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDateDisabled = (date: Date) => {
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate > today;
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate && !isDateDisabled(selectedDate)) {
            setDate(selectedDate);
            setOpen(true);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading moods</div>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col gap-4">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
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
                            Select your mood for {date?.toLocaleDateString()}
                        </p>
                        <div className="flex flex-col gap-2">
                            {(Object.keys(moods) as Mood[]).map((moodOption) => (
                                <Button
                                    key={moodOption}
                                    onClick={() => handleMoodSelection(moodOption)}
                                    className={`${moods[moodOption]} w-full`}
                                    disabled={saveMoodMutation.isPending}
                                >
                                    {saveMoodMutation.isPending
                                        ? "Saving..."
                                        : moodOption.charAt(0).toUpperCase() + moodOption.slice(1)
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