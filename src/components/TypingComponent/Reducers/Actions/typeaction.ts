import { TypingState } from "../reducer";

export function type(state: TypingState, key: string): TypingState {
    const words = state.words.slice(0);
    const word = words[state.wordIndex];

    if (!word) return state;

    word.isIncorrect = false;
    let mistyping = state.mistyping;

    // Extra characters
    if (state.charIndex >= word.chars.length) {
        // Count existing extra characters
        const extraCharsCount = word.chars.filter(char => char.type === 'extra').length;
        
        // If there are already 10 extra characters, do nothing
        if (extraCharsCount >= 10) {
            return state;
        }

        // Add extra character
        word.chars = [
            ...word.chars,
            {
                content: key,
                type: 'extra',
            },
        ];
        
        // Mark word as incorrect when it has extra characters
        word.isIncorrect = true;
        mistyping++;

        return {
            ...state,
            wordIndex: state.wordIndex,
            charIndex: state.charIndex + 1,
            words,
            mistyping,
        };
    }

    // Handle normal character typing
    const char = word.chars[state.charIndex];
    const isCorrect = key === char.content;

    if (isCorrect) {
        char.type = 'correct';
    } else {
        char.type = 'incorrect';
        word.isIncorrect = true;
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