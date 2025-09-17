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
import { TypingContext } from "@/context/typing.context";
import { ProfileContext } from "@/context/profile.context";
import Input from "./Input";





export default function Typingsetting() {

    const [time, settime] = useState<number>(15);
    const [mode, setmode] = useState<"Story" | "Affirmation">("Affirmation");
    const [response, setResponse] = useState<any>(null);
    const [istyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Typing state management
    const [typingWords, setTypingWords] = useState<TypingWords>([]);
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");

    const { typingStarted, onTypingStarted, onTypingEnded, onUpdateTypingFocus } = useContext(TypingContext);
    const profileContext = useContext(ProfileContext);

    if (!profileContext) {
        throw new Error('ProfileContext must be used within a ProfileProvider');
    }

    const { profile } = profileContext;

    const wordRef = useRef<HTMLDivElement>(null);
    const charRef = useRef<HTMLSpanElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (istyping) hiddenInputRef.current?.focus();
    }, [istyping])

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
        }
    }, [response]);

    // Handle typing input
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!typingWords.length) return;

        const currentWord = typingWords[wordIndex];
        if (!currentWord) return;

        if (e.key === 'Backspace') {
            e.preventDefault();
            if (charIndex > 0) {
                setCharIndex(charIndex - 1);
                const updatedWords = [...typingWords];
                updatedWords[wordIndex].chars[charIndex - 1].type = 'none';
                setTypingWords(updatedWords);
                setInputValue(inputValue.slice(0, -1));
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
            }

            const updatedWords = [...typingWords];
            const expectedChar = currentWord.chars[charIndex];

            if (expectedChar) {
                if (e.key === expectedChar.content) {
                    updatedWords[wordIndex].chars[charIndex].type = 'correct';
                } else {
                    updatedWords[wordIndex].chars[charIndex].type = 'incorrect';
                    updatedWords[wordIndex].isIncorrect = true;
                }

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
            }
        }
    };

    // Add event listener for typing
    useEffect(() => {
        if (typingWords.length > 0) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [typingWords, wordIndex, charIndex, inputValue, typingStarted, onTypingStarted]);





    const times = [15, 30, 60, 90, 120];
    const modes = ["Story", "Affirmation"];

    const trpc = useTRPC();

    const modeSchema = z.enum(["Story", "Affirmation"]);
    type modeschema = z.infer<typeof modeSchema>;

    console.log(time);
    console.log(mode);

    const typingresponse = useMutation(trpc.typingResponse.typingsendmessage.mutationOptions({
        onSuccess: (data) => {
            console.log("Typing settings saved:", data);
            toast.success("Typing settings saved!" + data);
        },

        onError: (error: any) => {
            console.error("Error saving typing settings:", error);
        }
    }));

    const handletypingresponsesubmit = async (data: { mode: modeschema, time: number }) => {
        try {
            console.log("Handletypingresponse is called : ", data);
            const result = await typingresponse.mutateAsync(data);
            console.log("Result from typing response mutation : ", result);
            toast.success("Typing response generated successfully! : " + result.typingResponse);
            setResponse(result.typingResponse);
            return result.typingResponse;
        }

        catch (error) {
            console.error("Error in handletypingresponse:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error in handletypingresponse: " + errorMessage);
        }



    }

    return (
        <>
            <div className="flex max-h-screen flex-col items-center justify-start pt-20 px-4 ">
                <div className=" w-full max-w-4xl mb-8 fixed top-[20%]">
                    <Card className="m-0 p-0 bg-transparent border-0 shadow-none">
                        <CardContent className="flex gap-1 justify-center items-center flex-wrap">
                            {times.map((t) => {
                                return (
                                    <div className="cursor-pointer" key={t}>

                                        <div className={"p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
                                            (time === t ? " text-primary font-bold " : "")
                                        } onClick={() => settime(t)}>

                                            {t}
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="text-muted-foreground opacity-35 text-center 
                             flex items-center justify-center font-extrabold text-xl "> |</div>
                            {modes.map((m) => {
                                return (
                                    <div className="flex gap-2 " key={m}>

                                        <div className={"p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
                                            (mode === m ? " text-primary font-bold " : "")
                                        } onClick={() => setmode(m as typeof mode)}>
                                            <span className="flex items-center gap-2">
                                                {m === "Affirmation" ? <BookIcon className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                                                {m}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className="text-muted-foreground opacity-35 text-center">
                                <Button onClick={() => { handletypingresponsesubmit({ mode: mode as modeschema, time: time }); }} className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90">
                                    Click me to test
                                </Button>



                            </div>

                        </CardContent>
                    </Card>




                </div>
                <div className="w-full max-w-4xl flex justify-center items-center mt-8">
                    {typingWords.length > 0 ? (
                        <div className="w-full max-w-3xl">
                            <Input
                                words={typingWords}
                                wordIndex={wordIndex}
                                charIndex={charIndex}
                            />
                        </div>
                    ) : (
                        <div className="text-center max-w-3xl">
                            <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed">
                                {response ? response : "Click generate to get your personalized typing content"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}