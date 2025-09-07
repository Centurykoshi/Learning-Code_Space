"use client";

import CalenderWork from "./Calender";
import CanvasforCalendar from "./Canvas";
// import CanvasMoodTracker from "./DrawingCanvas";
import MoodTracker from "./MoodTracker";


export default function Background() {
    return (
        <div className="flex min-h-screen bg-transparent rounded-2xl ">
            <div className="max-w-[800px] max-h-[90vh]  border-2 flex justify-center items-center m-auto p-10 rounded-2xl bg-primary-foreground/10 backdrop-blur-lg shadow-lg ">

              {/* <CalenderWork /> */}
              {/* <CanvasMoodTracker /> */}
              <MoodTracker />
              
            </div>

        </div>

    )
}