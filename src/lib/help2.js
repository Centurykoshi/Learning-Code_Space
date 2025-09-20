"use client";

import { useContext, useEffect, useRef, useState, useReducer, useCallback } from "react"
import { CardContent, Card } from "../ui/card";
import { BookIcon, StarIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { TypingContext } from "@/context/typing.context";
import { ProfileContext } from "@/context/profile.context";
import { getRandomQuoteByLength } from '@/services/quotable';
import { getRandomWords, getTypingWords } from '@/helpers';
import { useSound } from '@/hooks';
import { IconLock } from '@/assets/image';
import typewriterSound from '@/assets/audio/typewriter.wav';
import typingReducer, { initialState } from './reducer/typing.reducer';
import { Loading } from '@/components/UI';
import Input from "./Input";
import Restart from './Restart';
import Counter from './Counter';
import LoadingError from './LoadingError';
import styles from './Typing.module.scss';

// Used to abort previous fetch call if new one is called
let quoteAbortController: AbortController | null = null;

export default function Typingsetting() {
    const [time, settime] = useState<number>(15);
    const [mode, setmode] = useState<"Story" | "Affirmation" | "words" | "quote">("Affirmation");
    const [response, setResponse] = useState<any>(null);
    const [isCapsLock, setIsCapsLock] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingError, setLoadingError] = useState<404 | 500 | null>(null);



;

    // Mouse focus handling


    // Main typing event handler
    useEffect(() => {
        const typeHandler = (event: KeyboardEvent) => {
            const { key } = event;

            if (key === 'Escape') {
                onUpdateTypingFocus(false);
            }

            if (event.getModifierState && event.getModifierState('CapsLock')) {
                setIsCapsLock(true);
            } else {
                setIsCapsLock(false);
            }
            
            if (event.ctrlKey && key === 'Backspace') {
                onUpdateTypingFocus(true);
                playTypingSound();
                return dispatch({ type: 'DELETE_WORD' });
            }
            
            if (key === 'Backspace') {
                onUpdateTypingFocus(true);
                playTypingSound();
                return dispatch({ type: 'DELETE_KEY' });
            }
            
            if (key === ' ') {
                event.preventDefault();
                onUpdateTypingFocus(true);
                playTypingSound();
                return dispatch({ type: 'NEXT_WORD' });
            }
            
            if (key.length === 1) {
                if (!typingStarted) {
                    onTypingStarted();
                }
                onUpdateTypingFocus(true);
                playTypingSound();
                return dispatch({ type: 'TYPE', payload: key });
            }
        };
        
        if (isTypingDisabled) {
            document.removeEventListener('keydown', typeHandler);
        } else {
            document.addEventListener('keydown', typeHandler);
        }

        return () => document.removeEventListener('keydown', typeHandler);
    }, [
        typingStarted,
        onTypingStarted,
        mode,
        isTypingDisabled,
        playTypingSound,
    ]);

    // Handle typing start
    useEffect(() => {
        if (typingStarted) {
            dispatch({
                type: 'START',
                payload: `${mode}`,
            });
        }
    }, [typingStarted]);

    // Convert response text to TypingWords format when API response comes
    useEffect(() => {
        if (response) {
            const words = getTypingWords(response.split(' '));
            dispatch({ type: 'RESTART', payload: words });
            setIsLoading(false);
        }
    }, [response]);

    const onRestart = useCallback(() => {
        onTypingEnded();
        onUpdateTypingFocus(false);

        quoteAbortController?.abort();
        quoteAbortController = new AbortController();
        setIsLoading(false);
        setLoadingError(null);

        if (mode === "words") {
            dispatch({
                type: 'RESTART',
                payload: getRandomWords(50, false, false),
            });
        } else if (mode === "quote") {
            dispatch({ type: 'RESTART', payload: [] });
            setIsLoading(true);

            getRandomQuoteByLength(50, undefined, quoteAbortController).then((data) => {
                if (
                    (data.statusCode && data.statusCode === 404) ||
                    data.statusCode === 500
                ) {
                    setLoadingError(data.statusCode);
                    setIsLoading(false);
                    return;
                }

                dispatch({
                    type: 'NEW_WORDS',
                    payload: {
                        words: getTypingWords(
                            data.content.replace(/—/g, '-').replace(/…/g, '...').split(' ')
                        ),
                        author: data.author,
                    },
                });

                setIsLoading(false);
                setLoadingError(null);
            });
        }
    }, [mode, onTypingEnded, onUpdateTypingFocus]);

    const onRepeat = () => {
        onTypingEnded();
        onUpdateTypingFocus(false);
        dispatch({ type: 'RESTART' });
    };

    // Check for completion
    useEffect(() => {
        if (!state.words.length) return;

        const lastWordCorrect =
            state.wordIndex === state.words.length - 1 &&
            state.words[state.wordIndex].chars.every((char) => char.type === 'correct');

        if (state.wordIndex === state.words.length || lastWordCorrect) {
            onUpdateTypingFocus(false);
        }
    }, [state.words, state.charIndex, state.wordIndex]);

    // Initialize on mount
    useEffect(() => {
        onRestart();
        setTypemodeVisible(true);

        return () => {
            quoteAbortController?.abort();
        };
    }, [onRestart]);

    // API mutation for getting typing content
    const typingresponse = useMutation(trpc.typingResponse.typingsendmessage.mutationOptions({
        onSuccess: (data) => {
            console.log("Typing settings saved:", data);
            toast.success("Typing content generated!");
        },
        onError: (error: any) => {
            console.error("Error saving typing settings:", error);
            toast.error("Failed to generate typing content");
        }
    }));

    const handletypingresponsesubmit = async (data: { mode: modeschema, time: number }) => {
        try {
            setIsLoading(true);
            const result = await typingresponse.mutateAsync(data);
            toast.success("Typing response generated successfully!");
            setResponse(result.typingResponse);
            return result.typingResponse;
        } catch (error) {
            console.error("Error in handletypingresponse:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error generating content: " + errorMessage);
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex max-h-screen flex-col items-center justify-start pt-20 px-4">
                <div className="w-full max-w-4xl mb-8 fixed top-[20%]">
                    <Card className="m-0 p-0 bg-transparent border-0 shadow-none">
                        <CardContent className="flex gap-1 justify-center items-center flex-wrap">
                            {times.map((t) => (
                                <div className="cursor-pointer" key={t}>
                                    <div className={
                                        "p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
                                        (time === t ? " text-primary font-bold " : "")
                                    } onClick={() => settime(t)}>
                                        {t}
                                    </div>
                                </div>
                            ))}
                            <div className="text-muted-foreground opacity-35 text-center flex items-center justify-center font-extrabold text-xl">|</div>
                            {modes.map((m) => (
                                <div className="flex gap-2" key={m}>
                                    <div className={
                                        "p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
                                        (mode === m ? " text-primary font-bold " : "")
                                    } onClick={() => setmode(m as typeof mode)}>
                                        <span className="flex items-center gap-2">
                                            {m === "Affirmation" && <BookIcon className="w-4 h-4" />}
                                            {m === "Story" && <StarIcon className="w-4 h-4" />}
                                            {m}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div className="text-muted-foreground opacity-35 text-center">
                                <Button 
                                    onClick={() => {
                                        if (mode === "Story" || mode === "Affirmation") {
                                            handletypingresponsesubmit({ mode: mode as modeschema, time: time });
                                        } else {
                                            onRestart();
                                        }
                                    }} 
                                    className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Generating..." : "Generate Content"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full max-w-4xl flex justify-center items-center mt-8">
                    <div className={styles.typing}>
                        <div className={styles['typing__container']}>
                            <Counter
                                mode={mode}
                                counter={state.wordIndex}
                                wordsLength={state.words.length}
                            />

                            {isCapsLock && (
                                <div className={styles.capslock}>
                                    <IconLock className={styles.icon} />
                                    <p>CAPS LOCK</p>
                                </div>
                            )}
                            
                            {loadingError && state.words.length === 0 ? (
                                <LoadingError status={loadingError} />
                            ) : state.words.length > 0 ? (
                                <Input
                                    words={state.words}
                                    wordIndex={state.wordIndex}
                                    charIndex={state.charIndex}
                                />
                            ) : (
                                <div className="text-center max-w-3xl">
                                    <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed">
                                        Click generate to get your personalized typing content
                                    </p>
                                </div>
                            )}
                            
                            <Restart onRestart={onRestart} className={styles.restart} />
                        </div>

                        {isLoading && <Loading type="spinner" className={styles['loading-spinner']} />}
                    </div>
                </div>
            </div>
        </>
    )
}