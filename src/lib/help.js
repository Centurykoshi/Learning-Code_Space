import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Heart, Frown, Angry, Coffee, Zap } from 'lucide-react';

type Mood = 'happy' | 'sad' | 'angry' | 'relaxed' | 'anxious';

export default function CalenderWork() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [moodData, setMoodData] = useState<Record<string, Mood>>({});

  const moods = {
    happy: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
    sad: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    angry: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    relaxed: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    anxious: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  };

  const moodIcons = {
    happy: <Heart className="w-4 h-4" />,
    sad: <Frown className="w-4 h-4" />,
    angry: <Angry className="w-4 h-4" />,
    relaxed: <Coffee className="w-4 h-4" />,
    anxious: <Zap className="w-4 h-4" />,
  };

  const moodColors = {
    happy: 'bg-emerald-400',
    sad: 'bg-blue-400',
    angry: 'bg-red-400',
    relaxed: 'bg-purple-400',
    anxious: 'bg-orange-400',
  };

  const handleMoodSelect = (mood: Mood) => {
    if (selectedDate) {
      const dateKey = selectedDate.toDateString();
      setMoodData(prev => ({ ...prev, [dateKey]: mood }));
      setOpen(false);
    }
  };

  const modifiers = Object.entries(moodData).reduce((acc, [dateStr, mood]) => {
    const date = new Date(dateStr);
    if (!acc[mood]) acc[mood] = [];
    acc[mood].push(date);
    return acc;
  }, {} as Record<Mood, Date[]>);

  const modifiersClassNames = Object.keys(moods).reduce((acc, mood) => {
    acc[mood as Mood] = `${moodColors[mood as Mood]} text-white font-semibold rounded-full`;
    return acc;
  }, {} as Record<Mood, string>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Mood Tracker</h1>
            <p className="text-gray-600">Track your daily emotions and discover patterns</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="cursor-pointer">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setOpen(true);
                      }
                    }}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                    className="rounded-lg border border-gray-200 bg-white shadow-sm mx-auto"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 bg-white border border-gray-200 rounded-xl shadow-lg">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">How are you feeling?</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.keys(moods) as Mood[]).map((mood) => (
                      <Button
                        key={mood}
                        onClick={() => handleMoodSelect(mood)}
                        variant="outline"
                        className={`${moods[mood]} justify-start gap-3 h-12 transition-all duration-200 hover:scale-105`}
                      >
                        {moodIcons[mood]}
                        <span className="capitalize font-medium">{mood}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(Object.keys(moods) as Mood[]).map((mood) => (
                <div key={mood} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full ${moodColors[mood]}`}></div>
                  <span className="capitalize text-gray-700 font-medium">{mood}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Click on any date to log your mood for that day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}