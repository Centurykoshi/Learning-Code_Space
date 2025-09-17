"use client";

import { useCallback, useContext, useEffect, useReducer, useState } from "react"
import { CardContent, Card } from "../ui/card";
import { BookIcon, StarIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { TypingContext } from "./context/typingContext";
import { TypingWords } from "@/hooks/types";
import { getTypingWords } from "./context/helper";
let quoteAbortController: AbortController | null = null;

export default function Typingsetting() {

    const [time, settime] = useState<number>(15);
    const [mode, setmode] = useState<"Story" | "Affirmation">("Affirmation");
    const [response, setResponse] = useState<any>(null);
    const [isCapslock, setisCapslock] = useState(false);
    const [timeCountdown, settimecountdown] = useState<number>(time);
    const [isLoading, setisLoading] = useState(false);
    const [TypingWords, setTypingWords] = useState<TypingWords>([]);
    const {
        typingDisabled,
        typingStarted,
        typingFocused,
        onUpdateTypingFocus,
        onTypingStarted,
        onTypingEnded,
        setTypemodeVisible,
    } = useContext(TypingContext);

    const istypingDisabled = typingDisabled || isLoading;

    useEffect(() => {
        const handleMousemove = () => {
            onUpdateTypingFocus(false);
        };

        if (typingFocused) {
            window.addEventListener("mousemove", handleMousemove);
        }

        return () => {
            document.removeEventListener("mousemove", handleMousemove);
        }
    }, [typingFocused]);

    useEffect(() => {
        const typehanlder = (event: KeyboardEvent) => {
            const { key } = event;

            if (key === "Escape") {
                onUpdateTypingFocus(false);
            }

            if (event.getModifierState && event.getModifierState("CapsLock")) {
                setisCapslock(true);
            }
            else {
                setisCapslock(false);
            }

            if (event.ctrlKey && key === "Backspace") {
                onUpdateTypingFocus(true);
            }

            if (key === "Backspace") {
                onUpdateTypingFocus(true);
            }
            if (key === " ") {
                event.preventDefault();
                onUpdateTypingFocus(true);
            }
            if (key.length === 1) {
                if (!typingStarted) {
                    onTypingStarted();
                }
                onUpdateTypingFocus(true);
            }
        };
        if (istypingDisabled) {
            document.removeEventListener("keydown", typehanlder);

        } else {
            document.addEventListener("keydown", typehanlder);
        }
        return () => document.removeEventListener("keydown", typehanlder);
    }, [
        typingStarted,
        onTypingStarted,
        mode,
        time,
        istypingDisabled,
    ]);


    const onRestart = useCallback(() => {
        onTypingEnded();
        onUpdateTypingFocus(false);

        quoteAbortController?.abort();
        quoteAbortController = new AbortController();
        setisLoading(false);

        if (response !== null) {
            if (!response) {
                setisLoading(true);
            }
            else {
                const typingresponse = getTypingWords(response.split(" "));
                setisLoading(false);

            }
        }
    }, [time, mode, response, onTypingEnded, onUpdateTypingFocus]);


    // const onRepeat = () => {
    //     onTypingEnded();
    //     onUpdateTypingFocus(false);
    //     dispatch({ type: 'RESTART' });

    //     if (mode === 'Story') {
    //         setTimeCountdown(time);
    //     }
    // };

    useEffect(() => {
        onRestart();

        return () => {
            quoteAbortController?.abort();
        };
    }, [onRestart]);








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
                <div className="w-full max-w-4xl flex justify-center items-center">
                    <div className="text-center max-w-3xl">
                        <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed">
                            {response ? response : "Click generate to get your personalized typing content"}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}