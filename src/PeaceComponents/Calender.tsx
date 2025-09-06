"use Client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverTrigger, Popover } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Mode } from "fs";
import { ComponentProps, useRef, useState } from "react"
import { object, tuple } from "zod";
const [usedColor, setUsedColor] = useState<Set<string>>(new Set());



export default function CalenderWork() {

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);
    const [mood, setMood] = useState<{ [key: string]: Mood }>({});
    const [options, setoptions] = useState(false);
    const [usedColor, setUsedColor] = useState<Set<string>>(new Set());

    const canvasRef = useRef<HTMLCanvasElement>(null);




    type Mood = keyof typeof moods;

    const moods = {
        happy: "bg-yellow-400 text-black",
        sad: "bg-blue-500 text-white",
        angry: "bg-red-500 text-white",
        relaxed: "bg-green-500 text-white",
        anxious: "bg-purple-500 text-white",
    } as const;

    const handlemoodSelection = (mood: Mood) => {
        if (!date) return;

        const key = date.toISOString().slice(0, 10);

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
        const moodType = mood[dateString]; // typed as Mood
        modifiers[moodType].push(new Date(dateString));
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
            setUsedColor(new Set())


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


                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-2 space-y-2">
                            <p className="text-sm text-muted-foreground">Select your Mood
                            </p>
                            <div className="flex flex-1 justify-center items-center">
                                {(Object.keys(moods) as Mood[]).map((mood) => (
                                    <Button key={mood} onClick={() => handlemoodSelection(mood)}
                                        className={`${moods[mood]} w-full`}>
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
