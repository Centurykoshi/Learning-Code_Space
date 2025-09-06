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


  const moodColors = {
    great: 'bg-emerald-500',
    good: 'bg-green-400', 
    okay: 'bg-yellow-400',
    bad: 'bg-orange-400',
    horrible: 'bg-red-500',
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

  const undoStack: string[] = [];
const redoStack: string[] = [];

const saveState = () => {
  const canvas = canvasRef.current;
  if (canvas) {
    undoStack.push(canvas.toDataURL());
    redoStack.length = 0; // clear redo history
  }
};

const restoreState = (state: string) => {
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = state;
    img.onload = () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0);
    };
  }
};

const handleUndo = () => {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop()!;
    redoStack.push(lastState);
    const prevState = undoStack[undoStack.length - 1];
    if (prevState) restoreState(prevState);
  }
};

const handleRedo = () => {
  if (redoStack.length > 0) {
    const state = redoStack.pop()!;
    undoStack.push(state);
    restoreState(state);
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
    great: `${moodColors.great} text-white font-semibold rounded-full`,
    good: `${moodColors.good} text-white font-semibold rounded-full`,
    okay: `${moodColors.okay} text-white font-semibold rounded-full`,
    bad: `${moodColors.bad} text-white font-semibold rounded-full`,
    horrible: `${moodColors.horrible} text-white font-semibold rounded-full`,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Creative Mood Tracker</h1>
            <p className="text-gray-600">Express your feelings through colors and drawings</p>
          </div>

          {!showCanvas && !showOptions ? (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  disabled={isDateDisabled}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm mx-auto"
                />
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How it works</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Click on any past or current date to express your mood</p>
                  <p>• Draw or paint using up to 2 colors from the palette</p>
                  <p>• Your mood will be determined by the colors you choose</p>
                  <p>• Future dates are disabled - you can only track past emotions</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Color Meanings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {colors.map((colorData) => (
                    <div key={colorData.color} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0" 
                        style={{ backgroundColor: colorData.color }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-700">{colorData.name}</p>
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
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Palette className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Express Your Emotions</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  How would you like to express your feelings for{' '}
                  <span className="font-semibold text-purple-600">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>?
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-transparent hover:border-purple-200 transition-all duration-200">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Draw Your Emotions</h3>
                    <p className="text-gray-600 text-sm">
                      Use colors and shapes to express your feelings through art
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Choose Brush Size:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {brushSizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setBrushSize(size)}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                brushSize === size
                                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                              }`}
                            >
                              <div 
                                className={`rounded-full ${
                                  brushSize === size ? 'bg-purple-400' : 'bg-gray-400'
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

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Available Colors:</p>
                        <div className="flex gap-2 justify-center">
                          {colors.map((colorData) => (
                            <div key={colorData.color} className="text-center">
                              <div 
                                className="w-8 h-8 rounded-full border-2 border-gray-300 mx-auto"
                                style={{ backgroundColor: colorData.color }}
                                title={`${colorData.name} - ${colorData.mood} emotions`}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">You can choose up to 2 colors</p>
                      </div>

                      <Button
                        onClick={startDrawingSession}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        Start Drawing
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-600">More Options</h3>
                    <p className="text-gray-500 text-sm">
                      Additional ways to express emotions coming soon!
                    </p>
                    <Button
                      disabled
                      variant="outline"
                      className="w-full opacity-50 cursor-not-allowed"
                    >
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setShowOptions(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
                  <h2 className="text-xl font-semibold text-gray-800">Express Your Mood</h2>
                  <p className="text-sm text-gray-600">
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
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      Colors Used: {usedColors.size}/2
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Brush Size:</span>
                    <div className="flex gap-1">
                      {brushSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setBrushSize(size)}
                          className={`px-3 py-1 text-xs rounded-md transition-colors font-medium ${
                            brushSize === size
                              ? 'bg-purple-500 text-white shadow-sm'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={clearCanvas} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button 
                      onClick={saveMood} 
                      disabled={usedColors.size === 0}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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
                        className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                          currentColor === colorData.color 
                            ? 'border-gray-800 scale-110 shadow-lg' 
                            : 'border-gray-300 hover:border-gray-400'
                        } ${
                          !canUse ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                        } ${isUsed ? 'ring-2 ring-offset-2 ring-purple-400' : ''}`}
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

                {usedColors.size >= 2 && (
                  <div className="text-center text-sm text-orange-600 bg-orange-50 rounded-lg p-3 mt-4">
                    You've reached the maximum of 2 colors. You can only use the colors you've already selected.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}