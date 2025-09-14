"use client";

import { useState } from "react"
import { CardContent, Card } from "../ui/card";

export default function Typingsetting() {

    const [time, settime] = useState<number>(15);
    const [mode, setmode] = useState<"story" | "affirmation">("affirmation");

    const times = [15, 30, 60, 90, 120];
    const modes = ["story", "affirmation"];


    return (
        <>
            <div>
                <div>
                    <Card>
                        <CardContent>
                            {times.map((t) >)}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}