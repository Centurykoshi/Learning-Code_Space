import { getTypingResults } from "@/hooks/types";
import { twoDecimals } from "../../context/helper";
import { TypingState } from "../reducer";


export default function result(state: TypingState, time?: number): TypingState {
    // Don't show result if already showing
    if (state.result.showResult) {
        return state;
    }

    const timeline = [...state.result.timeline];
    const currentDate = new Date();

    // If we have typing data, add final timeline entry
    if (state.dateTypingStarted && state.typed > 0) {
        const timeTook = time ? time * 1000 : (currentDate.getTime() - state.dateTypingStarted);
        timeline.push({
            second: time || twoDecimals(timeTook / 1000),
            ...getTypingResults(
                state.typed,
                state.typedCorrectly,
                state.mistyping,
                timeTook
            ),
        });
    } else if (timeline.length === 0) {
        // If no typing data, create a minimal timeline entry
        timeline.push({
            second: time || 0,
            wpm: 0,
            accuracy: 100,
            raw: 0,
        });
    }

    return {
        ...state,
        result: {
            ...state.result,
            showResult: true,
            timeline,
            date: currentDate,
            errors: state.mistyping,
        },
    };
}