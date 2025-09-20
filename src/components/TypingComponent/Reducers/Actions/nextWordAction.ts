import { TypingState } from "../reducer";


export  function nextWord(state: TypingState): TypingState {
    const words = state.words.slice(0);
    let mistyping = state.mistyping;

    const word = words[state.wordIndex];

    let prevWordCorrectChars = 0;
    for (let i = 0; i < word.chars.length; i++) {
        const char = word.chars[i];
        if (char.type !== 'correct') {
            word.isIncorrect = true;
        } else {
            prevWordCorrectChars++;
        }
    }

    return {
        ...state,
        wordIndex: state.wordIndex + 1,
        charIndex: 0,
        words,
        mistyping,
        typed: state.typed + 1,
        typedCorrectly: word.isIncorrect
            ? state.typedCorrectly - prevWordCorrectChars
            : state.typedCorrectly + 1,

    };
}