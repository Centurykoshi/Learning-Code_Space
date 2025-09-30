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
    const totalTimeUsed = time || (state.totalTime || 0);

    // Always ensure we have at least one timeline entry for the chart
    if (state.dateTypingStarted && state.typed > 0) {
        // If we have typing data, add final timeline entry
        const timeTook = time ? time * 1000 : (currentDate.getTime() - state.dateTypingStarted);
        timeline.push({
            second: twoDecimals(timeTook / 1000),
            ...getTypingResults(
                state.typed,
                state.typedCorrectly,
                state.mistyping,
                timeTook
            ),
        });
    } else {
        // If no typing data or timeline is empty, create entries to show time progression
        if (timeline.length === 0) {
            // Create a simple timeline showing the time that passed
            for (let i = 0; i <= totalTimeUsed && i <= 5; i++) {
                timeline.push({
                    second: i,
                    wpm: 0,
                    accuracy: 100,
                    raw: 0,
                });
            }
        }
    }

    return {
        ...state,
        result: {
            ...state.result,
            showResult: true,
            timeline,
            date: currentDate,
            errors: state.mistyping,
            testType: state.timeMode ? 'time' : 'words',
        },
    };
}