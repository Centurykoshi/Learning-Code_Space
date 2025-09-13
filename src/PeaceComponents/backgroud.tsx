"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalenderWork from "./Calender";
import CanvasforCalendar from "./Canvas";
import OrderByChat from "./Charts/Orderbychat";

// import CanvasMoodTracker from "./DrawingCanvas";
import MoodTracker from "./MoodTracker";



export default function Background() {
    return (
        <div className="flex min-h-screen bg-transparent rounded-2xl ">
            <div className="max-w-[80vw] max-h-[90vh]  border-2 flex justify-center items-center m-auto p-10 rounded-2xl bg-primary-foreground/10 backdrop-blur-lg shadow-lg gap-4 ">

                {/* <CalenderWork /> */}
                {/* <CanvasMoodTracker /> */}
                <div className="grid grid-cols-1 gap-4 min-w-[35vw]">
                    <MoodTracker />

                </div>
                {/* <ZoomI width={500} height={600} /> */}
                <div className="w-full">
                    <div className="grid grid-cols-1  gap-4">

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Learning about Charts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <OrderByChat  />
                            </CardContent>
                        </Card>
                    </div>
                </div>
               

            </div>

        </div>

    )
}