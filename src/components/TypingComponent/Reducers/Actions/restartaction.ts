import { TypingWords } from "@/hooks/types";

import { TypingState } from "../reducer";

export  function restart(
    state: TypingState,
    words?: TypingWords
): TypingState {
    return {
        ...state,
        words:
            words ||
            state.words.map((word) => ({
                isIncorrect: false,
                chars: word.chars.flatMap((char) =>
                    char.type === 'extra' ? [] : { content: char.content, type: 'none' }
                ),
            })),
        wordIndex: 0,
        charIndex: 0,
        typed: 0,
        typedCorrectly: 0,
        mistyping: 0,
        dateTypingStarted: null,
    };
}