import { TypingState } from "../reducer";


export  function start(state: TypingState, testType: string): TypingState {
    return {
        ...state,
        dateTypingStarted: state.dateTypingStarted || new Date().getTime(),
    };
}