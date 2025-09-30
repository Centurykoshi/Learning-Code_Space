import { getTypingResults } from "@/hooks/types";
import { TypingState } from "../reducer";


export default function timeline(state: TypingState): TypingState {
    if (!state.dateTypingStarted || state.result.showResult) return state;

    return {
        ...state,
        result: {
            ...state.result,
            timeline: [
                ...state.result.timeline,
                {
                    second: state.result.timeline.length + 1,
                    ...getTypingResults(
                        state.typed,
                        state.typedCorrectly,
                        state.mistyping,
                        new Date().getTime() - state.dateTypingStarted
                    ),
                },
            ],
        },
    };
}