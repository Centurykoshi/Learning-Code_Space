import { TypingState } from "../reducer";

export function setTimer(state: TypingState, timeInSeconds: number): TypingState {
    return {
        ...state,
        timeRemaining: timeInSeconds,
        totalTime: timeInSeconds,
        timeMode: true,
    };
}

export function tickTimer(state: TypingState): TypingState {
    if (!state.timeMode || state.timeRemaining === null || state.timeRemaining <= 0) {
        return state;
    }

    const newTimeRemaining = state.timeRemaining - 1;

    return {
        ...state,
        timeRemaining: newTimeRemaining,
    };
}

export function timerComplete(state: TypingState): TypingState {
    return {
        ...state,
        timeRemaining: 0,
        result: {
            ...state.result,
            showResult: true,
        },
    };
}