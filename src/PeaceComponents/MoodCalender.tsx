import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import z from 'zod';

const Mood = z.enum(["great", "good", "okay", "bad", "horrible"]);
type Mood = z.infer<typeof Mood>;

interface ColorData {
    color: string;
    name: string;
    mood: Mood;
}

interface MoodCalendarProps {
    selectedDate?: Date;
    onDateSelect: (date: Date | undefined) => void;
    moodData: { [key: string]: Mood };
    colors: ColorData[];
}

export default function MoodCalendar({
    selectedDate,
    onDateSelect,
    moodData,
    colors
}: MoodCalendarProps) {
    const moodColors = {
        great: 'border-b-4 border-yellow-500',
        good: 'border-b-4 border-purple-400',
        okay: 'border-b-4 border-green-300',
        bad: 'border-b-4 border-blue-400',
        horrible: 'border-b-4 border-red-400',
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDateDisabled = (date: Date) => {
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate > today;
    };

    const parseDateKey = (dateKey: string): Date => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // Create modifiers for calendar
    const modifiers = {
        great: [] as Date[],
        good: [] as Date[],
        okay: [] as Date[],
        bad: [] as Date[],
        horrible: [] as Date[]
    };

    if (moodData && Object.keys(moodData).length > 0) {
        Object.keys(moodData).forEach(dateString => {
            const moodType = moodData[dateString];
            if (moodType && modifiers[moodType]) {
                try {
                    const localDate = parseDateKey(dateString);
                    modifiers[moodType].push(localDate);
                } catch (e) {
                    // Skip invalid dates silently
                }
            }
        });
    }

    const modifiersClassNames = {
        great: `${moodColors.great} text-muted-foreground font-semibold`,
        good: `${moodColors.good} text-muted-foreground font-semibold`,
        okay: `${moodColors.okay} text-muted-foreground font-semibold`,
        bad: `${moodColors.bad} text-muted-foreground font-semibold`,
        horrible: `${moodColors.horrible} text-muted-foreground font-semibold`,
    };

    return (
        <div className="space-y-6">
            {/* Move styles to a separate style tag that persists */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .calendar-container .rdp-day_selected {
                        position: relative;
                        background-color: rgba(59, 130, 246, 0.1) !important;
                    }
                    
                    .calendar-container .rdp-day_selected.border-b-4 {
                        border-bottom-width: 4px !important;
                    }
                    
              
                    
                    .calendar-container .rdp-day:hover {
                        background-color: rgba(59, 130, 246, 0.05) !important;
                    }
                `
            }} />

            <div className="bg-transparent rounded-xl p-6">
                <div className="calendar-container">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={onDateSelect}
                        modifiers={modifiers}
                        modifiersClassNames={modifiersClassNames}
                        disabled={isDateDisabled}
                        className="rounded-lg border bg-transparent shadow-sm mx-auto"
                        key={`calendar-${Object.keys(moodData).length}`}
                         // Force re-render with styles
                    />
                </div>
            </div>

            <div className="bg-transparent rounded-xl p-6">
                <h3 className="text-lg font-semibold text-muted-foreground mb-4">Color Meanings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {colors.map((colorData) => (
                        <div key={colorData.color} className="flex items-center gap-2 text-sm">
                            <div
                                className="w-6 h-6 rounded-full border-2 flex-shrink-0"
                                style={{ backgroundColor: colorData.color }}
                            ></div>
                            <div>
                                <p className="font-medium">{colorData.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{colorData.mood}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}