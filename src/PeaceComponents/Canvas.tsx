
import { useRef, useState } from "react";

interface Canvas {
    selectedDate: Date;
    initialBrushSize?: number;
}

export default function CanvasforCalendar({ selectedDate, initialBrushSize = 5 }: Canvas) {

    type Mood = 'great' | 'good' | 'okay' | 'bad' | 'horrible';


    const [isdrawing, setisdrawing] = useState(false);
    const [mooddata, setMoodData] = useState<Record<string, { mood: Mood; colors: string[] }>>({});
    const [usedColor, setUsedColor] = useState<Set<string>>(new Set());
    const [currentColor, setCurrentcolor] = useState("#ff6b6b");
   const [brushSize, setBrushSize] = useState(initialBrushSize);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [options, setoptions] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);

    const undoStack: string[] = [];
    const redoStack: string[] = [];


    const brushSizes = [2, 4, 8, 12, 16, 20];

    const colors = [
        { color: '#ff6b6b', name: 'Red', mood: 'horrible' },    // Anger, intense negative
        { color: '#4ecdc4', name: 'Teal', mood: 'good' },       // Calm, peaceful
        { color: '#45b7d1', name: 'Blue', mood: 'bad' },        // Sadness, low energy
        { color: '#96ceb4', name: 'Green', mood: 'okay' },      // Neutral, balanced
        { color: '#feca57', name: 'Yellow', mood: 'great' },    // Joy, excitement
    ];

    const moodColors = {
        great: 'bg-emerald-500',
        good: 'bg-green-400',
        okay: 'bg-yellow-400',
        bad: 'bg-orange-400',
        horrible: 'bg-red-500',
    };


    const startdrawingSession = () => {
        setoptions(false);
        setShowCanvas(true);
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

    const startdrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (usedColor.size >= 1 && !usedColor.has(currentColor)) {
            return; // Can't use more than 1 colors
        }

        setisdrawing(true);
        setUsedColor(prev => new Set([...prev, currentColor]));



        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
        }

    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isdrawing) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.lineTo(x, y);
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = brushSize;
                ctx.lineCap = "round";
                ctx.stroke();
            }
        }
    }

    const savestate = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            undoStack.push(canvas.toDataURL());
            redoStack.length = 0;
        }
    }

    const restoreState = (state: string) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.src = state;
            img.onload = () => {
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.drawImage(img, 0, 0);
            }
        }
    };

    const handleundo = () => {
        if (undoStack.length > 0) {
            const lastsate = undoStack.pop()!;
            redoStack.push(lastsate);
            const previous = undoStack[undoStack.length - 1];
            if (previous) restoreState(previous);
        }
    }

    const handleRedo = () => {
        if (redoStack.length > 0) {
            const state = redoStack.pop()!;
            undoStack.push(state);
            restoreState(state);
        }
    }

    const stopdrawing = () => {
        setisdrawing(false);
        savestate();
    };
    const getMoodFromColor = (color: string): Mood => {
        return colors.find(c => c.color === color)?.mood || 'okay';
    };


    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
        setUsedColor(new Set());
    };

    const saveMood = () => {
        if (selectedDate && usedColor.size > 0) {
            const datekey = selectedDate.toDateString();
            const firstColor = Array.from(usedColor)[0];
            const mood = getMoodFromColor(firstColor);
            const colorArray = Array.from(usedColor);

            setMoodData(prev => ({
                ...prev,
                [datekey]: { mood, colors: colorArray }
            }));

            setShowCanvas(false);
            setoptions(false);
            setUsedColor(new Set());

        }
    }; 
    

    return (
     <>
        <div>
            </div>    
     </>
    )




}