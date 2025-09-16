"use client";

import { useState } from "react"
import { CardContent, Card } from "../ui/card";
import { BookIcon, StarIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";

export default function Typingsetting() {

    const [time, settime] = useState<number>(15);
    const [mode, setmode] = useState<"Story" | "Affirmation">("Affirmation");

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
            toast.error("Error saving typing settings: " + error.message);
        }
    }));

    const handletypingresponsesubmit = async (data: { mode: modeschema , time: number }) => {
        try{
        console.log("Handletypingresponse is called : ", data);
        const result = await typingresponse.mutateAsync(data);
        console.log("Result from typing response mutation : ", result);
        toast.success("Typing response generated successfully! : " + result);
        return result ;
        }

        catch(error){ 
            console.error("Error in handletypingresponse:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error in handletypingresponse: " + errorMessage);
        }

       

    }

    return (
        <>
            <div className="fixed top-30 left-[37%]">
                <div className="flex justify-start items-start">
                    <Card className="m-0 p-0 bg-transparent border-0 shadow-2xl">
                        <CardContent className="flex gap-1">
                            {times.map((t) => {
                                return (
                                    <div className="cursor-pointer">

                                        <div key={(t)} className={"p-2 text-muted-foreground text-sm scale-100 hover:scale-120 hover:text-primary ease-in-out duration-200 cursor-pointer" +
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
                                <Button onClick={() => handletypingresponsesubmit({ mode: mode as modeschema, time: time })} className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90">
                                    Click me to test 
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}