import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Palette, RotateCcw, Save, X } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';

type Mood = 'great' | 'good' | 'okay' | 'bad' | 'horrible';

export default function CanvasMoodTracker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [moodData, setMoodData] = useState<{ [key: string]: Mood }>({});
  const [usedColors, setUsedColors] = useState<Set<string>>(new Set());
  const [currentColor, setCurrentColor] = useState('#ff6b6b');
  const [brushSize, setBrushSize] = useState(5);

  // TRPC setup
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

  // Available brush sizes
  const brushSizes = [2, 5, 8, 12, 16, 20];

  // Color palette with mood associations
  const colors = [
    { color: '#ff6b6b', name: 'Red', mood: 'horrible' as Mood },      // Anger, intense negative
    { color: '#4ecdc4', name: 'Teal', mood: 'good' as Mood },         // Calm, peaceful
    { color: '#45b7d1', name: 'Blue', mood: 'bad' as Mood },          // Sadness, low energy
    { color: '#96ceb4', name: 'Green', mood: 'okay' as Mood },        // Neutral, balanced
    { color: '#feca57', name: 'Yellow', mood: 'great' as Mood },      // Joy, excitement
  ];

  const moodColors = {
    great: 'border-b-4 border-emerald-500 bg-emerald-50',
    good: 'border-b-4 border-green-400 bg-green-50',
    okay: 'border-b-4 border-yellow-400 bg-yellow-50',
    bad: 'border-b-4 border-orange-400 bg-orange-50',
    horrible: 'border-b-4 border-red-500 bg-red-50',
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (date: Date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateKey = (dateKey: string): Date => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDateDisabled(date)) {
      setSelectedDate(date);
      setShowOptions(true);
      setUsedColors(new Set());
    }
  };

  const startDrawingSession = () => {
    setShowOptions(false);
    setShowCanvas(true);
    // Clear canvas when opening
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }, 100);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (usedColors.size >= 2 && !usedColors.has(currentColor)) {
      return; // Can't use more than 2 colors
    }

    setIsDrawing(true);
    setUsedColors(prev => new Set([...prev, currentColor]));

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(x, y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setUsedColors(new Set());
  };

  const analyzeMoodFromColors = (colorSet: Set<string>): Mood => {
    const colorArray = Array.from(colorSet);
    const colorMoods = colorArray.map(color =>
      colors.find(c => c.color === color)?.mood || 'okay'
    );

    // Count each mood type
    const moodCounts = {
      great: colorMoods.filter(mood => mood === 'great').length,
      good: colorMoods.filter(mood => mood === 'good').length,
      okay: colorMoods.filter(mood => mood === 'okay').length,
      bad: colorMoods.filter(mood => mood === 'bad').length,
      horrible: colorMoods.filter(mood => mood === 'horrible').length,
    };

    // Find the mood with the highest count
    const maxCount = Math.max(...Object.values(moodCounts));
    const dominantMood = Object.keys(moodCounts).find(
      mood => moodCounts[mood as Mood] === maxCount
    ) as Mood;

    return dominantMood || 'okay';
  };

  const saveMood = async () => {
    if (selectedDate && usedColors.size > 0) {
      const dateKey = formatDateKey(selectedDate);
      const mood = analyzeMoodFromColors(usedColors);

      // Update local state immediately for better UX
      setMoodData(prev => ({
        ...prev,
        [dateKey]: mood
      }));

      try {
        await saveMoodMutation.mutateAsync({
          selectedDate: dateKey,
          mood: mood as string
        });
        
        setShowCanvas(false);
        setShowOptions(false);
        setUsedColors(new Set());
      } catch (error) {
        // Revert local state if save failed
        setMoodData((prev) => {
          const newState = { ...prev };
          delete newState[dateKey];
          return newState;
        });
      }
    }
  };

  const handleMoodSelection = async (selectedMood: Mood) => {
    if (!selectedDate) return;

    const key = formatDateKey(selectedDate);

    // Update local state immediately for better UX
    setMoodData((prev) => ({
      ...prev,
      [key]: selectedMood,
    }));

    try {
      await saveMoodMutation.mutateAsync({
        selectedDate: key,
        mood: selectedMood as string
      });
    } catch (error) {
      // Revert local state if save failed
      setMoodData((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }

    setShowOptions(false);
  };

  // Load moods from database when component mounts
  useEffect(() => {
    if (allMoods) {
      const moodMap: { [key: string]: Mood } = {};
      allMoods.forEach((moodEntry: any) => {
        // The backend returns date as string in YYYY-MM-DD format
        moodMap[moodEntry.date] = moodEntry.mood as Mood;
      });
      setMoodData(moodMap);
    }
  }, [allMoods]);

  // Create modifiers for calendar
  const modifiers: Record<Mood, Date[]> = {
    great: [],
    good: [],
    okay: [],
    bad: [],
    horrible: [],
  };

  Object.entries(moodData).forEach(([dateString, moodType]) => {
    const localDate = parseDateKey(dateString);
    modifiers[moodType].push(localDate);
  });

  const modifiersClassNames = {
    great: `${moodColors.great} text-green-800 font-semibold rounded-lg`,
    good: `${moodColors.good} text-green-700 font-semibold rounded-lg`,
    okay: `${moodColors.okay} text-yellow-700 font-semibold rounded-lg`,
    bad: `${moodColors.bad} text-orange-700 font-semibold rounded-lg`,
    horrible: `${moodColors.horrible} text-red-700 font-semibold rounded-lg`,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {isLoading && (
        <div className="text-center py-4">
          <p>Loading your mood history...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-4 text-red-600">
          <p>Error loading mood data. Please try refreshing the page.</p>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Canvas Mood Tracker
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Select a Date</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border shadow-sm"
          />
        </div>

        {/* Options and Canvas Section */}
        <div className="space-y-4">
          {showOptions && selectedDate && (
            <div className="p-6 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                How are you feeling on {selectedDate.toDateString()}?
              </h3>
              
              <div className="space-y-3 mb-4">
                {['great', 'good', 'okay', 'bad', 'horrible'].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodSelection(mood as Mood)}
                    disabled={saveMoodMutation.isPending}
                    className="w-full p-3 text-left rounded-lg border-2 hover:bg-gray-100 transition-colors capitalize font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mood === 'great' && '😊'} 
                    {mood === 'good' && '🙂'} 
                    {mood === 'okay' && '😐'} 
                    {mood === 'bad' && '😞'} 
                    {mood === 'horrible' && '😢'} 
                    {' '} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    {saveMoodMutation.isPending && ' (Saving...)'}
                  </button>
                ))}
              </div>

              <div className="border-t pt-4">
                <Button
                  onClick={startDrawingSession}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={saveMoodMutation.isPending}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Express with Colors
                </Button>
              </div>
            </div>
          )}

          {showCanvas && (
            <div className="p-6 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Draw Your Mood</h3>
                <Button
                  onClick={() => setShowCanvas(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Canvas */}
              <div className="mb-4 border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="block cursor-crosshair w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>

              {/* Color Palette */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">
                  Colors ({usedColors.size}/2 used):
                </p>
                <div className="flex gap-2 mb-3">
                  {colors.map((colorObj) => {
                    const canUseColor = usedColors.has(colorObj.color) || usedColors.size < 2;
                    return (
                      <button
                        key={colorObj.color}
                        onClick={() => setCurrentColor(colorObj.color)}
                        disabled={!canUseColor}
                        className={`w-10 h-10 rounded-full border-3 transition-all ${
                          currentColor === colorObj.color
                            ? 'border-gray-800 scale-110 shadow-lg'
                            : 'border-gray-300'
                        } ${
                          !canUseColor ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorObj.color }}
                        title={`${colorObj.name} - represents ${colorObj.mood} mood`}
                      />
                    );
                  })}
                </div>
                {usedColors.size >= 2 && (
                  <p className="text-xs text-gray-600">
                    Maximum 2 colors reached. You can only use the colors you've already selected.
                  </p>
                )}
              </div>

              {/* Brush Size */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Brush Size:</p>
                <div className="flex gap-2 flex-wrap">
                  {brushSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        brushSize === size
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas Controls */}
              <div className="flex gap-3">
                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Canvas
                </Button>
                <Button
                  onClick={saveMood}
                  disabled={usedColors.size === 0 || saveMoodMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveMoodMutation.isPending ? 'Saving...' : 'Save Mood'}
                </Button>
              </div>

              {usedColors.size > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Analysis:</strong> The colors you use will be automatically analyzed to determine your mood. 
                    Current colors suggest: <strong>{analyzeMoodFromColors(usedColors)}</strong> mood.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mood Legend */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Color Mood Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {colors.map((colorObj) => (
            <div key={colorObj.color} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
                style={{ backgroundColor: colorObj.color }}
              />
              <div>
                <p className="font-medium text-sm">{colorObj.name}</p>
                <p className="text-xs text-gray-600 capitalize">{colorObj.mood}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}