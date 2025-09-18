"use client";

import Count from "./ReduxLearning/hooks/Count";
import Typingsetting from "./typingsettingdisplay";
import Typingheader from "./ypingheader";

export default function BackgroundTyping() {
    return (
        <div>
            <Typingheader />
            <Typingsetting />
            <Count />
        </div>
    )
}