"use client"; 
import CalenderWork from "./Calender";

export default function Background(){ 
    return (
        <div className="flex min-h-screen bg-transparent rounded-2xl ">
            <div className="max-w-[800px]  border-2 flex justify-center items-center m-auto p-10 rounded-2xl bg-primary-foreground/10 backdrop-blur-lg shadow-lg">
               
                <CalenderWork />
            </div>

        </div>
        
    )
}