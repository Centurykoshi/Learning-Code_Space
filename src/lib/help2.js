"use client";

import { useContext, useEffect, useRef, useState } from "react"
import { CardContent, Card } from "../ui/card";
import { BookIcon, StarIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { TypingWords } from "@/hooks/types";

import { cn } from "@/lib/utils";
import { TypingContext } from "./context/typingContext";

// Input component styles (you'll need to create this CSS module)
const inputStyles = {
    char: "text-2xl",
    charCorrect: "text-green-500",
    charIncorrect: "text-red-500 bg-red-100",
    charExtra: "text-red-500 bg-red-200",
    wordIncorrect: "underline decoration-red-500"
};

export default function TypingWithSettings() {
    const [isFocused, setIsFocused] = useState(false);

    // Typing state management
    const [typingWords, setTypingWords] = useState<TypingWords>([]);
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [wordsOffset, setWordsOffset] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [correctChars, setCorrectChars] = useState(0);
    const [totalChars, setTotalChars] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const { typingStarted, onTypingStarted, onTypingEnded, onUpdateTypingFocus, typingFocused, lineHeight } = useContext(TypingContext);
   

   

    const wordWrapperRef = useRef<HTMLDivElement>(null);
    const wordRef = useRef<HTMLDivElement>(null);
    const charRef = useRef<HTMLSpanElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const times = [15, 30, 60, 90, 120];
    const modes = ["Story", "Affirmation"];

    const trpc = useTRPC();
    const modeSchema = z.enum(["Story", "Affirmation"]);
    type modeschema = z.infer<typeof modeSchema>;

    // Focus hidden input when typing starts
    useEffect(() => {
        if (typingWords.length > 0) hiddenInputRef.current?.focus();
    }, [typingWords.length]);

    // Update words offset for scrolling
    useEffect(() => {
        if (!wordWrapperRef.current) return;
        const { offsetTop, offsetHeight } = wordWrapperRef.current;
        setWordsOffset(Math.max(offsetTop - offsetHeight, 0));
    }, [charIndex]);

    // Handle mouse movement to unfocus typing
    useEffect(() => {
        const handleMouseMove = () => {
            if (typingWords.length > 0) {
                onUpdateTypingFocus(false);
            }
        };

        if (typingFocused) {
            document.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [typingFocused, typingWords.length, onUpdateTypingFocus]);

    // Convert response text to TypingWords format
    useEffect(() => {
        if (response) {
            const words = response.split(' ').map((word: string) => ({
                isIncorrect: false,
                chars: word.split('').map((char: string) => ({
                    content: char,
                    type: 'none' as const
                }))
            }));
            setTypingWords(words);
            setWordIndex(0);
            setCharIndex(0);
            setInputValue("");
            setStartTime(null);
            setCorrectChars(0);
            setTotalChars(0);
            setIsComplete(false);
            onTypingEnded();
        }
    }, [response, onTypingEnded]);

    // Calculate WPM and accuracy
    useEffect(() => {
        if (startTime && totalChars > 0) {
            const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
            const currentWpm = Math.round((correctChars / 5) / timeElapsed);
            const currentAccuracy = Math.round((correctChars / totalChars) * 100);
            
            setWpm(currentWpm > 0 ? currentWpm : 0);
            setAccuracy(currentAccuracy);
        }
    }, [startTime, correctChars, totalChars]);

    // Check if typing is complete
    useEffect(() => {
        if (typingWords.length > 0) {
            const isLastWord = wordIndex >= typingWords.length - 1;
            const currentWord = typingWords[wordIndex];
            const isLastChar = currentWord && charIndex >= currentWord.chars.length;
            
            if (isLastWord && isLastChar) {
                setIsComplete(true);
                onTypingEnded();
            }
        }
    }, [wordIndex, charIndex, typingWords, onTypingEnded]);

    // Handle typing input
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!typingWords.length || isComplete) return;

        const currentWord = typingWords[wordIndex];
        if (!currentWord) return;

        if (e.key === 'Escape') {
            onUpdateTypingFocus(false);
            return;
        }

        onUpdateTypingFocus(true);

        if (e.key === 'Backspace') {
            e.preventDefault();
            if (charIndex > 0) {
                setCharIndex(charIndex - 1);
                const updatedWords = [...typingWords];
                const previousChar = updatedWords[wordIndex].chars[charIndex - 1];
                previousChar.type = 'none';
                setTypingWords(updatedWords);
                setInputValue(inputValue.slice(0, -1));
                
                // Update stats
                if (totalChars > 0) {
                    setTotalChars(totalChars - 1);
                    if (previousChar.type === 'correct') {
                        setCorrectChars(Math.max(0, correctChars - 1));
                    }
                }
            }
            return;
        }

        if (e.key === ' ') {
            e.preventDefault();
            if (wordIndex < typingWords.length - 1) {
                setWordIndex(wordIndex + 1);
                setCharIndex(0);
                setInputValue(inputValue + ' ');
            }
            return;
        }

        if (e.key.length === 1) {
            e.preventDefault();

            if (!typingStarted) {
                onTypingStarted();
                setStartTime(Date.now());
            }

            const updatedWords = [...typingWords];
            const expectedChar = currentWord.chars[charIndex];

            if (expectedChar) {
                if (e.key === expectedChar.content) {
                    updatedWords[wordIndex].chars[charIndex].type = 'correct';
                    setCorrectChars(correctChars + 1);
                } else {
                    updatedWords[wordIndex].chars[charIndex].type = 'incorrect';
                    updatedWords[wordIndex].isIncorrect = true;
                }
                setTotalChars(totalChars + 1);
                setTypingWords(updatedWords);
                setCharIndex(charIndex + 1);
                setInputValue(inputValue + e.key);
            } else {
                // Extra character
                updatedWords[wordIndex].chars.push({
                    content: e.key,
                    type: 'extra'
                });
                setTypingWords(updatedWords);
                setCharIndex(charIndex + 1);
                setInputValue(inputValue + e.key);
                setTotalChars(totalChars + 1);
            }
        }
    };

    // Add event listener for typing
    useEffect(() => {
        if (typingWords.length > 0 && !isComplete) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [typingWords, wordIndex, charIndex, inputValue, typingStarted, onTypingStarted, correctChars, totalChars, isComplete]);

    const typingresponse = useMutation(trpc.typingResponse.typingsendmessage.mutationOptions({
        onSuccess: (data) => {
            console.log("Typing settings saved:", data);
            toast.success("Typing content generated!");
            setResponse(data.typingResponse);
        },
        onError: (error: any) => {
            console.error("Error saving typing settings:", error);
            toast.error("Error generating content");
        }
    }));

    const handletypingresponsesubmit = async (data: { mode: modeschema, time: number }) => {
        try {
            console.log("Generating typing content:", data);
            const result = await typingresponse.mutateAsync(data);
            console.log("Result from typing response mutation:", result);
            return result.typingResponse;
        } catch (error) {
            console.error("Error in handletypingresponse:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error generating content: " + errorMessage);
        }
    };

    const resetTyping = () => {
        setResponse(null);
        setTypingWords([]);
        setWordIndex(0);
        setCharIndex(0);
        setInputValue("");
        setStartTime(null);
        setCorrectChars(0);
        setTotalChars(0);
        setIsComplete(false);
        onTypingEnded();
    };

    return (
        <>
            <div className="flex max-h-screen flex-col items-center justify-start pt-20 px-4">
                {/* Settings Bar */}
                <div className="w-full max-w-4xl mb-8 fixed top-[20%]">
                    <Card className="m-0 p-0 bg-transparent border-0 shadow-none">
                        <CardContent className="flex gap-1 justify-center items-center flex-wrap">
                            {times.map((t) => (
                                <div className="cursor-pointer" key={t}>
                                    <div 
                                        className={
                                            "p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
                                            (time === t ? " text-primary font-bold " : "")
                                        } 
                                        onClick={() => settime(t)}
                                    >
                                        {t}
                                    </div>
                                </div>
                            ))}
                            <div className="text-muted-foreground opacity-35 text-center flex items-center justify-center font-extrabold text-xl"> |</div>
                            {modes.map((m) => (
                                <div className="flex gap-2" key={m}>
                                    <div 
                                        className={
                                            "p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
                                            (mode === m ? " text-primary font-bold " : "")
                                        } 
                                        onClick={() => setmode(m as typeof mode)}
                                    >
                                        <span className="flex items-center gap-2">
                                            {m === "Affirmation" ? <BookIcon className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                                            {m}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div className="text-muted-foreground opacity-35 text-center">
                                <Button 
                                    onClick={() => handletypingresponsesubmit({ mode: mode as modeschema, time: time })} 
                                    className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90"
                                    disabled={typingresponse.isPending}
                                >
                                    {typingresponse.isPending ? "Generating..." : "Generate Content"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Live Stats */}
                {typingWords.length > 0 && (
                    <div className="flex gap-6 mb-4 text-sm">
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">WPM:</span>
                            <span className="font-bold">{wpm}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">Accuracy:</span>
                            <span className="font-bold">{accuracy}%</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="font-bold">{wordIndex + 1}/{typingWords.length}</span>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="w-full max-w-4xl flex justify-center items-center mt-8">
                    {typingWords.length > 0 ? (
                        <div className="w-full max-w-3xl">
                            {/* Typing Input Area */}
                            <div className="overflow-hidden relative" style={{ height: (lineHeight || 40) * 3 }}>
                                <input
                                    type="text"
                                    className={cn(
                                        "absolute top-0 right-0 bottom-0 left-0 opacity-0 z-10 select-none text-lg cursor-default",
                                        typingFocused ? "cursor-none" : ""
                                    )}
                                    autoCapitalize="off"
                                    ref={hiddenInputRef}
                                    tabIndex={-1}
                                />
                                
                                <div 
                                    className="flex flex-wrap select-none duration-75 text-2xl leading-relaxed"
                                    style={{ transform: typingStarted ? `translateY(-${wordsOffset}px)` : undefined }}
                                >
                                    {typingWords.map((word, wIndex) => {
                                        const isCurrentWord = wIndex === wordIndex;

                                        return (
                                            <div
                                                key={wIndex}
                                                className="overflow-hidden relative mr-2"
                                                ref={isCurrentWord ? wordWrapperRef : undefined}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex select-none duration-75",
                                                        word.isIncorrect ? "underline decoration-red-500" : ""
                                                    )}
                                                    ref={(node) => {
                                                        if (isCurrentWord && node) wordRef.current = node;
                                                    }}
                                                >
                                                    {word.chars.map((char, cIndex) => {
                                                        const isCurrentChar = isCurrentWord && cIndex === charIndex;
                                                        
                                                        return (
                                                            <span
                                                                key={cIndex}
                                                                className={cn(
                                                                    "relative",
                                                                    char.type === 'correct' && "text-green-500",
                                                                    char.type === 'incorrect' && "text-red-500 bg-red-100",
                                                                    char.type === 'extra' && "text-red-500 bg-red-200",
                                                                    isCurrentChar && "bg-yellow-200"
                                                                )}
                                                                ref={(node) => {
                                                                    if (isCurrentChar && node) {
                                                                        charRef.current = node;
                                                                    }
                                                                }}
                                                            >
                                                                {char.content}
                                                                {isCurrentChar && (
                                                                    <span className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-50 animate-pulse pointer-events-none" />
                                                                )}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Reset Button */}
                            <div className="mt-6 text-center">
                                <Button onClick={resetTyping} variant="outline">
                                    Generate New Content
                                </Button>
                            </div>

                            {/* Completion Message */}
                            {isComplete && (
                                <div className="mt-6 text-center p-4 bg-green-100 rounded-lg">
                                    <h3 className="text-lg font-bold text-green-800">Typing Complete!</h3>
                                    <p className="text-green-700">
                                        Final WPM: {wpm} | Accuracy: {accuracy}%
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center max-w-3xl">
                            <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed">
                                {response ? response : "Click generate to get your personalized typing content"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Loading Indicator */}
                {typingresponse.isPending && (
                    <div className="mt-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}
            </div>
        </>
    );
}