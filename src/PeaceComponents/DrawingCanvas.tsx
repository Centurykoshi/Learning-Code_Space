import React, { useState, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, RotateCcw, Save, X } from 'lucide-react';

type Mood = 'great' | 'good' | 'okay' | 'bad' | 'horrible';

export default function CanvasMoodTracker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [moodData, setMoodData] = useState<Record<string, { mood: Mood; colors: string[] }>>({});
  const [usedColors, setUsedColors] = useState<Set<string>>(new Set());
  const [currentColor, setCurrentColor] = useState('#ff6b6b');
  const [brushSize, setBrushSize] = useState(5);

  // Available brush sizes
  const brushSizes = [2, 5, 8, 12, 16, 20];

  // Color palette with mood associations - balanced
  const colors = [
    { color: '#ff6b6b', name: 'Red', mood: 'horrible' },    // Anger, intense negative
    { color: '#4ecdc4', name: 'Teal', mood: 'good' },       // Calm, peaceful
    { color: '#45b7d1', name: 'Blue', mood: 'bad' },        // Sadness, low energy
    { color: '#96ceb4', name: 'Green', mood: 'okay' },      // Neutral, balanced
    { color: '#feca57', name: 'Yellow', mood: 'great' },    // Joy, excitement
  ];

  const moodColors = {
    great: 'border-b-6 rounded-lg border-emerald-500',
    good: 'border-b-6 rounded-lg border-green-400',
    okay: 'border-b-6 rounded-lg border-yellow-400',
    bad: 'border-b-6 rounded-lg border-orange-400',
    horrible: 'border-b-6 rounded-lg border-red-500',
  };


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (date: Date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
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

  const saveMood = () => {
    if (selectedDate && usedColors.size > 0) {
      const dateKey = selectedDate.toDateString();
      const mood = analyzeMoodFromColors(usedColors);
      const colorArray = Array.from(usedColors);

      setMoodData(prev => ({
        ...prev,
        [dateKey]: { mood, colors: colorArray }
      }));

      setShowCanvas(false);
      setShowOptions(false);
      setUsedColors(new Set());
    }
  };

  // Create modifiers for calendar
  const modifiers = Object.entries(moodData).reduce((acc, [dateStr, data]) => {
    const date = new Date(dateStr);
    if (!acc[data.mood]) acc[data.mood] = [];
    acc[data.mood].push(date);
    return acc;
  }, {} as Record<Mood, Date[]>);

  const modifiersClassNames = {
    great: `${moodColors.great} text-muted-foreground font-semibold rounded-full `,
    good: `${moodColors.good} text-muted-foreground font-semibold rounded-full`,
    okay: `${moodColors.okay} text-muted-foreground font-semibold rounded-full `,
    bad: `${moodColors.bad} text-muted-foreground font-semibold rounded-full`,
    horrible: `${moodColors.horrible} text-muted-foreground font-semibold rounded-full `,
  };

  return (
    <div className="max-h-[80vh] bg-transparent border-1 p-6 overflow-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="bg-transparent rounded-2xl shadow-xl p-8 space-y-6">


          {!showCanvas && !showOptions ? (
            <div className="space-y-6">
              <div className="bg-transparent rounded-xl p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  disabled={isDateDisabled}
                  className="rounded-lg border bg-transparent shadow-sm mx-auto"
                />
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
                        <p className="font-medium ">{colorData.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{colorData.mood}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : showOptions ? (
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

              <div className=" ">
                <div className="bg-transparent rounded-xl p-6 border-2 border-transparent  transition-all duration-200">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-muted-foreground to-secondary-background rounded-full flex items-center justify-center">
                      <Palette className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary-background">Draw Your Emotions</h3>
                    <p className="text-muted-foreground text-sm">
                      Use Colors express your feelings through art
                    </p>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">Choose Brush Size:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {brushSizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setBrushSize(size)}
                              className={`p-3 transition-all duration-200 flex flex-col items-center gap-2 ${brushSize === size
                                ? "text-muted-foreground"
                                : "text-secondary-background"
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

                      <Button
                        onClick={startDrawingSession}
                        className="w-full rounded-lg cursor-pointer text-secondary-background"
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        Start Drawing
                      </Button>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setShowOptions(false)}
                  variant="outline"
                  className="text-muted-foreground rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setShowCanvas(false);
                    setShowOptions(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="border rounded-lg cursor-pointer "
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>

              <div className=" rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    <span className="font-medium ">
                      Colors Used: {usedColors.size}/2
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium ">Brush Size:</span>
                    <div className="flex gap-1">
                      {brushSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setBrushSize(size)}
                          className={`px-3 py-1 text-xs rounded-full transition-colors font-medium ${brushSize === size
                            ? 'bg-foreground text-background shadow-sm'
                            : 'bg-muted-background text-foreground hover:bg-primary-foreground'
                            }`}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={clearCanvas} variant="outline" size="sm" className="rounded-lg cursor-pointer">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      onClick={saveMood}
                      disabled={usedColors.size === 0}
                      className="bg-transparent border rounded-lg text-foreground cursor-pointer"
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 justify-center mb-4">
                  {colors.map((colorData) => {
                    const isUsed = usedColors.has(colorData.color);
                    const canUse = usedColors.size < 2 || isUsed;

                    return (
                      <button
                        key={colorData.color}
                        onClick={() => canUse && setCurrentColor(colorData.color)}
                        disabled={!canUse}
                        className={`w-6 h-6 rounded-full transition-all duration-200 ${currentColor === colorData.color
                          ? ' scale-110 border-2 border-background '
                          : ' hover:border-gray-400'
                          } ${!canUse ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                          } ${isUsed ? 'border-1 border-foreground' : ''}`}
                        style={{ backgroundColor: colorData.color }}
                        title={`${colorData.name} - ${colorData.mood}`}
                      />
                    );
                  })}
                </div>

                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="w-full bg-white cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>


              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}