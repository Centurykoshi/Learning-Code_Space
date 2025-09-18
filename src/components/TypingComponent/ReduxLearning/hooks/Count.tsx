"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";

import { increment, decrement } from "../slices/counter";

export default function () {

    const count = useAppSelector((state) => state.counter);
    const dispatch = useAppDispatch();
    return (
        <div className="flex justify-center items-center flex-col gap-4 h-full">





            <h1 className="block">Counter : {count} </h1>
            <Button onClick={() => dispatch(increment())}>Increment</Button>
            <Button onClick={() => dispatch(decrement())}>Decrement</Button>

        </div>
    )
}