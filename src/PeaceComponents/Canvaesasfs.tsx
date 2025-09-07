import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, RotateCcw, Save, X } from 'lucide-react';

type Mood = 'great' | 'good' | 'okay' | 'bad' | 'horrible';

interface ColorData {
    color: string;
    name: string;
    mood: Mood;
}

interface DrawingCanvasProps {
    selectedDate?: Date;
    colors: ColorData[];
    brushSize: number;
    setBrushSize: (size: number) => void;
    onSave: (usedColors: Set<string>) => void;
    onClose: () => void;
}

export default function DrawingCanvas({
    selectedDate,
    colors,
    brushSize,
    setBrushSize,
    onSave,
    onClose
}: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [usedColors, setUsedColors] = useState<Set<string>>(new Set());
    const [currentColor, setCurrentColor] = useState('#ff6b6b');

    const brushSizes = [2, 5, 8, 12, 16, 20];

    useEffect(() => {
        // Clear canvas when component mounts
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (usedColors.size >= 2 && !usedColors.has(currentColor)) {
            return;
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

    const handleSave = () => {
        onSave(usedColors);
    };

    return (
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
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="border rounded-lg cursor-pointer"
                >
                    <X className="w-4 h-4 mr-2" />
                    Close
                </Button>
            </div>

            <div className="rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        <span className="font-medium">
                            Colors Used: {usedColors.size}/2
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Brush Size:</span>
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
                            onClick={handleSave}
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
                                        ? 'scale-110 border-2 border-background'
                                        : 'hover:border-gray-400'
                                    } ${!canUse ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${isUsed ? 'border-1 border-foreground' : ''
                                    }`}
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
    );
}