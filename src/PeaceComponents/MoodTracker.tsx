import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';


import MoodCalendar from './MoodCalender';
import DrawingCanvas from './Canvaesasfs';
import { Palette } from 'lucide-react';

type Mood = 'great' | 'good' | 'okay' | 'bad' | 'horrible';

export default function MoodTracker() {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [showCanvas, setShowCanvas] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [moodData, setMoodData] = useState<{ [key: string]: Mood }>({});
    const [usedColors, setUsedColors] = useState<Set<string>>(new Set());
    const [brushSize, setBrushSize] = useState(5);

    const trpc = useTRPC();

    const Save_Mood_Mutation = useMutation(trpc.moodRespone.SaveMood.mutationOptions({
        onSuccess: (data) => {
            console.log('Mutation success:', data);
            toast.success("Mood saved to the database");
        },
        onError: (error) => {
            console.error('Mutation error:', error);
            toast.error(`Failed to save mood: ${error.message || 'Unknown error'}`);
        }
    }));

    const { data: allMoods, isLoading, error } = useQuery(trpc.moodRespone.getAllMood.queryOptions());

    // Color palette with mood associations
  const colors = [
    { color: '#ff6b6b', name: 'Red', mood: 'horrible' as Mood },    // Anger, intense negative
    { color: '#af5dcfff', name: 'Teal', mood: 'good' as Mood },       // Calm, peaceful
    { color: '#6394d4ff', name: 'Blue', mood: 'bad' as Mood },        // Sadness, low energy
    { color: '#96ceb4', name: 'Green', mood: 'okay' as Mood },      // Neutral, balanced
    { color: '#feca57', name: 'Yellow', mood: 'great' as Mood },    // Joy, excitement
  ];
    const formatDateKey = (date: Date): string => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            console.error('Invalid date passed to formatDateKey:', date);
            return '';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const analyzeMoodFromColors = (colorSet: Set<string>): Mood => {
        const colorArray = Array.from(colorSet);
        const colorMoods = colorArray.map(color =>
            colors.find(c => c.color === color)?.mood || 'okay'
        );

        const moodCounts = {
            great: colorMoods.filter(mood => mood === 'great').length,
            good: colorMoods.filter(mood => mood === 'good').length,
            okay: colorMoods.filter(mood => mood === 'okay').length,
            bad: colorMoods.filter(mood => mood === 'bad').length,
            horrible: colorMoods.filter(mood => mood === 'horrible').length,
        };

        const maxCount = Math.max(...Object.values(moodCounts));
        const dominantMood = Object.keys(moodCounts).find(
            mood => moodCounts[mood as Mood] === maxCount
        ) as Mood;

        return dominantMood || 'okay';
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            setShowOptions(true);
            setUsedColors(new Set());
        }
    };

    const startDrawingSession = () => {
        setShowOptions(false);
        setShowCanvas(true);
    };

    const saveMood = async (colors: Set<string>) => {
        if (selectedDate && colors.size > 0) {
            const dateKey = formatDateKey(selectedDate);
            const mood = analyzeMoodFromColors(colors);

            setMoodData(prev => ({
                ...prev,
                [dateKey]: mood
            }));

            try {
                await Save_Mood_Mutation.mutateAsync({
                    date: dateKey,
                    mood: mood
                });

                setShowCanvas(false);
                setShowOptions(false);
                setUsedColors(new Set());
            } catch (error) {
                setMoodData((prev) => {
                    const newState = { ...prev };
                    delete newState[dateKey];
                    return newState;
                });
            }
        }
    };

    const closeAll = () => {
        setShowCanvas(false);
        setShowOptions(false);
        setSelectedDate(undefined);
    };

    useEffect(() => {
        if (allMoods && Array.isArray(allMoods)) {
            const moodMap: { [key: string]: Mood } = {};
            allMoods.forEach((moodEntry: any) => {
                if (moodEntry && moodEntry.date && moodEntry.mood) {
                    moodMap[moodEntry.date] = moodEntry.mood;
                }
            });
            setMoodData(moodMap);
        }
    }, [allMoods]);

    return (
        <div className="max-h-[80vh] bg-transparent border-1 p-6 overflow-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto">
                <div className="bg-transparent rounded-2xl shadow-xl p-8 space-y-6">
                    {!showCanvas && !showOptions ? (
                        <MoodCalendar
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            moodData={moodData}
                            colors={colors}
                        />
                    ) : showCanvas ? (
                        <DrawingCanvas
                            selectedDate={selectedDate}
                            colors={colors}
                            brushSize={brushSize}
                            setBrushSize={setBrushSize}
                            onSave={saveMood}
                            onClose={closeAll}
                        />
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    How would you like to express your feelings for{' '}
                                    <span className="font-semibold text-muted-background">
                                        {selectedDate?.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>?
                                </p>
                            </div>

                            <div className="bg-transparent rounded-xl p-6 border-2 border-transparent transition-all duration-200">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-muted-foreground to-secondary-background rounded-full flex items-center justify-center">
                                        <div className="w-8 h-8 text-muted-foreground flex justify-center items-center"><Palette className='w-12 h-12' /></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-background">Draw Your Emotions</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Use Colors to express your feelings through art
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-3">Choose Brush Size:</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[2, 5, 8, 12, 16, 20].map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setBrushSize(size)}
                                                        className={`p-3 transition-all duration-200 flex flex-col items-center gap-2 ${brushSize === size ? "text-muted-foreground" : "text-secondary-background"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`rounded-full cursor-pointer ${brushSize === size ? 'bg-secondary-foreground' : 'bg-primary-foreground'
                                                                }`}
                                                            style={{
                                                                width: `${Math.max(size, 8)}px`,
                                                                height: `${Math.max(size, 8)}px`
                                                            }}
                                                        />
                                                        <span className="text-xs font-medium">{size}px</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={startDrawingSession}
                                            className="w-full rounded-lg cursor-pointer text-secondary-background p-3 bg-primary flex justify-center items-center gap-4"
                                        >
                                            <Palette className='w-5 h-5' /> Start Drawing
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={closeAll}
                                    className="text-muted-foreground rounded-lg cursor-pointer px-4 py-2 border"
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}