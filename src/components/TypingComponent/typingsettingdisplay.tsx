"use client";

import { useCallback, useContext, useEffect, useReducer, useState, useMemo } from "react"
import { CardContent, Card } from "../ui/card";
import { BookIcon, LockIcon, StarIcon } from "lucide-react";
import { NotifyOnChangeProps, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { TypingContext } from "./context/typingContext";
import { TypingWords } from "@/hooks/types";
import { getTypingWords } from "./context/helper";
import typingReducer, { initialState } from "./Reducers/reducer";
import Input from "./Input";
let quoteAbortController: AbortController | null = null;

interface Props {
    onCaretPostionChange?: (wordIndex: number, charIndex: number) => void;
}

export default function Typingsetting({ onCaretPostionChange }: Props) {

    const [time, settime] = useState<number>(15);
    const [mode, setmode] = useState<"Story" | "Affirmation">("Affirmation");
    const [response, setResponse] = useState<any>(null);
    const [isCapslock, setisCapslock] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    const {
        typingDisabled,
        typingStarted,
        typingFocused,
        onUpdateTypingFocus,
        onTypingStarted,

    } = useContext(TypingContext);





    const times = [15, 30, 60, 90, 120];
    const modes = ["Story", "Affirmation"];

    const trpc = useTRPC();

    const modeSchema = z.enum(["Story", "Affirmation"]);
    type modeschema = z.infer<typeof modeSchema>;

    // Remove console.log that causes re-renders
    // console.log(time);
    // console.log(mode);

    const istypingDisabled = typingDisabled || isLoading;

    const [state, dispatch] = useReducer(typingReducer, initialState);

    useEffect(() => {
        const handleMousemove = () => {
            onUpdateTypingFocus(false);
        };

        if (typingFocused) {
            document.addEventListener("mousemove", handleMousemove);
        }

        return () => {
            document.removeEventListener("mousemove", handleMousemove);
        }
    }, [typingFocused, onUpdateTypingFocus]);

    const typehandler = useCallback((event: KeyboardEvent) => {
        const { key } = event;

        if (key === "Escape") {
            onUpdateTypingFocus(false);
            return;
        }

        if (event.getModifierState && event.getModifierState("CapsLock")) {
            setisCapslock(true);
        } else {
            setisCapslock(false);
        }

        if (event.ctrlKey && key === "Backspace") {
            onUpdateTypingFocus(true);
            dispatch({ type: "DELETE_WORD" });
            return;
        }

        if (key === "Backspace") {
            onUpdateTypingFocus(true);
            dispatch({ type: "DELETE_KEY" });
            return;
        }

        if (key === " ") {
            event.preventDefault();
            onUpdateTypingFocus(true);
            dispatch({ type: "NEXT_WORD" });
            return;
        }

        if (key.length === 1) {
            if (!typingStarted) {
                onTypingStarted();
            }
            onUpdateTypingFocus(true);
            dispatch({ type: "TYPE", payload: key });
            return;
        }
    }, [typingStarted, onTypingStarted, onUpdateTypingFocus, dispatch]);

    useEffect(() => {
        if (istypingDisabled) {
            document.removeEventListener("keydown", typehandler);
        } else {
            document.addEventListener("keydown", typehandler);
        }

        return () => document.removeEventListener("keydown", typehandler);
    }, [istypingDisabled, typehandler]);

    useEffect(() => {
        if (response) {
            const words = getTypingWords(response.split(" "));
            dispatch({ type: "RESTART", payload: words });
            setisLoading(false);
        }
    }, [response]);

    if (response) {

    }

    useEffect(() => {
        if (typingStarted) {
            dispatch({
                type: "START",
                payload: `${mode}`,
            })
        }
    }, [typingStarted])



    useEffect(() => {
        if (!state.words.length) return;

        const lastWordCorrect =
            state.wordIndex === state.words.length - 1 &&
            state.words[state.wordIndex].chars.every((char) => char.type === 'correct');

        if (state.wordIndex === state.words.length || lastWordCorrect) {
            onUpdateTypingFocus(false);
        }
    }, [state.wordIndex, onUpdateTypingFocus]); // Removed unnecessary dependencies







    const typingresponse = useMutation(trpc.typingResponse.typingsendmessage.mutationOptions({
        onSuccess: (data) => {
            console.log("Typing settings saved:", data);
            toast.success("Typing settings saved!" + data);
        },

        onError: (error: any) => {
            console.error("Error saving typing settings:", error);
        }
    }));

    const handletypingresponsesubmit = useCallback(async (data: { mode: modeschema, time: number }) => {
        try {
            console.log("Handletypingresponse is called : ", data);
            setisLoading(true);
            const result = await typingresponse.mutateAsync(data);
            console.log("Result from typing response mutation : ", result);
            toast.success("Typing response generated successfully!");

            const words = getTypingWords(result.typingResponse.split(" "));
            console.log("Converted Words : ", words);
            dispatch({ type: "RESTART", payload: words });
            setResponse(result.typingResponse);
            setisLoading(false);
            return result.typingResponse;
        } catch (error) {
            console.error("Error in handletypingresponse:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error in handletypingresponse: " + errorMessage);
            setisLoading(false);
        }
    }, [typingresponse, dispatch]);

    // Memoize the button click handler to prevent re-creation on every render
    const handleGenerateClick = useCallback(() => {
        handletypingresponsesubmit({ mode: mode as modeschema, time: time });
    }, [handletypingresponsesubmit, mode, time]);

    // Memoize time selection components
    const timeSelectionElements = useMemo(() =>
        times.map((t) => (
            <div className="cursor-pointer" key={t}>
                <div
                    className={"p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
                        (time === t ? " text-primary font-bold " : "")
                    }
                    onClick={() => settime(t)}
                >
                    {t}
                </div>
            </div>
        )),
        [time, times]
    );

    // Memoize mode selection components
    const modeSelectionElements = useMemo(() =>
        modes.map((m) => (
            <div className="flex gap-2 " key={m}>
                <div
                    className={"p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
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
        )),
        [mode, modes]
    );

    useEffect(() => {
        if (onCaretPostionChange) {
            onCaretPostionChange(state.wordIndex, state.charIndex);
        }
    }, [state.wordIndex, state.charIndex, onCaretPostionChange]);

    return (
        <>
            <div className="min-h-screen relative m-0 overflow-hidden">
                <div className=" w-full max-w-6xl  m-0 ">
                    <Card className="m-0 p-0 bg-transparent border-0 shadow-none relative  top-30">
                        <CardContent className="flex gap-1 justify-center items-center flex-wrap ">
                            {timeSelectionElements}
                            <div className="text-muted-foreground opacity-35 text-center 
                             flex items-center justify-center font-extrabold text-xl "> |</div>
                            {modeSelectionElements}

                            <div className="text-muted-foreground opacity-35 text-center">
                                <Button
                                    onClick={handleGenerateClick}
                                    className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Generating..." : "Generate Content"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="relative top-50 min-h-screen m-0 overflow-hidden">
                        <div className="text-center  max-w-7xl">
                            {isCapslock && (
                                <div className="flex items-center bg-primary color-primary-foreground 
                                px-4 py-2 border-r-0 absolute top-[-35] left-[50%] transform -translate-x-1/2
                               whitespace-nowrap">
                                    <LockIcon className="w-4 h-4" />
                                    <p>Caps Lock On</p>
                                </div>
                            )}
                            {state.words.length > 0 ? (
                                <Input
                                    words={state.words}
                                    wordIndex={state.wordIndex}
                                    charIndex={state.charIndex}
                                    fontSize={32}
                                />
                            ) : (
                                <p className="text-muted-foreground leading-relaxed">
                                    Click generate to get your personalized typing content
                                </p>
                            )}

                        </div>

                    </div>




                </div>
            </div>
        </>
    )
}