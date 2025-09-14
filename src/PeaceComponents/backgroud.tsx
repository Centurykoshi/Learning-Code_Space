"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CardComponent from "./CardComponent";
import OrderByChat from "./Charts/Orderbychat";

// import CanvasMoodTracker from "./DrawingCanvas";
import MoodTracker from "./MoodTracker";




export default function Background() {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [showOptions, setShowOptions] = useState(false);

    const handleMarkNowClick = () => {
        const today = new Date();
        setSelectedDate(today);
        setShowOptions(true);
    };

    const handleCloseOptions = () => {
        setShowOptions(false);
        setSelectedDate(undefined);
    };
    return (
        <div className="flex min-h-screen bg-transparent rounded-2xl ">
            <div className="max-w-[80vw] max-h-[100vh]  border-none flex justify-center items-center m-auto p-10 rounded-2xl bg-primary-foreground/10 backdrop-blur-lg shadow-lg gap-4 ">




                {/* <CalenderWork /> */}
                {/* <CanvasMoodTracker /> */}
                <div className="grid grid-row-2 gap-2 min-w-[35vw] ">
                    <CardComponent onMarkNowClick={handleMarkNowClick} />

                    <OrderByChat />

                </div>
                {/* <ZoomI width={500} height={600} /> */}
                <div className="w-full ">
                    <div className="grid grid-cols-1  gap-4  ">

                        <Card className="bg-transparent border-none">
                            <CardContent>
                                <MoodTracker
                                    {...(showOptions && selectedDate ? {
                                        externalSelectedDate: selectedDate,
                                        externalShowOptions: showOptions,
                                        onCloseOptions: handleCloseOptions
                                    } : {})}
                                />

                            </CardContent>
                        </Card>
                    </div>
                </div>


            </div>

        </div>

    )
}