import { TypingState } from "../reducer";

export  function type(state: TypingState, key: string): TypingState {
    const words = state.words.slice(0);


    const word = words[state.wordIndex];

    if (!word) return state;

    word.isIncorrect = false;
    const char = words[state.wordIndex].chars[state.charIndex];
    let mistyping = state.mistyping;

    // Extra characters
    if (state.charIndex === word.chars.length) {
        // If there are 10 extra characters, do nothing (return state)
        if (
            word.chars.length > 10 &&
            word.chars[word.chars.length - 10].type === 'extra'
        ) {
            return state;
        }

        // Add extra character
        word.chars = [
            ...word.chars,
            {
                content: key!,
                type: 'extra',
            },
        ];
        mistyping++;

        return {
            ...state,
            wordIndex: state.wordIndex,
            charIndex: state.charIndex + 1,
            words,
            mistyping,
        };
    }

    const isCorrect = key === char.content;

    if (isCorrect) {
        char.type = 'correct';
    } else {
        char.type = 'incorrect';
        mistyping++;
    }

    return {
        ...state,
        wordIndex: state.wordIndex,
        charIndex: state.charIndex + 1,
        words,
        mistyping,
        typed: state.typed + 1,
        typedCorrectly: isCorrect ? state.typedCorrectly + 1 : state.typedCorrectly,
    };
}