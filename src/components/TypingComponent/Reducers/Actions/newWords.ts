import { TypingWords } from "@/hooks/types";
import { TypingState } from "../reducer";

export  function newWords(
    state: TypingState,
    payload: { words: TypingWords; }
): TypingState {
    return {
        ...state,
        words: payload.words,

    }
}