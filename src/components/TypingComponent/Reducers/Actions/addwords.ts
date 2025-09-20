import { TypingState } from "../reducer";
import { TypingWords } from "@/hooks/types";

export  function addwords(
    state: TypingState,
    words: TypingWords
): TypingState {
    return {
        ...state,
        words: { ...state.words, ...words },
    };

}