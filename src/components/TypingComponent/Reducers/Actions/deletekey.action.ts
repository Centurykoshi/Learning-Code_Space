import { error } from "console";
import { TypingState } from "../reducer";


export default function deleteKey(state: TypingState): TypingState {


  if (state.charIndex === 0) {
    const prevWordIndex = state.wordIndex - 1;

    const prevWordCorrectChars = state.words[prevWordIndex].isIncorrect
      ? state.words[prevWordIndex].chars.reduce((acc, char) => {
          return char.type === 'correct' ? acc + 1 : acc;
        }, 0)
      : -1;

    return {
      ...state,
      wordIndex: prevWordIndex,
      charIndex: state.words[prevWordIndex].chars.length,
      typedCorrectly: state.typedCorrectly + prevWordCorrectChars,
    };
  }

  const updatedWords = state.words.slice(0);
  const currentWord = updatedWords[state.wordIndex];
  const prevChar = currentWord.chars[state.charIndex - 1];

  let wasCorrect = false;
  if (prevChar.type === 'extra') {
    currentWord.chars.pop();
  } else {
    if (prevChar.type === 'correct') {
      wasCorrect = true;
    }
    prevChar.type = 'none';
  }

  updatedWords[state.wordIndex] = currentWord;

  return {
    ...state,
    charIndex: state.charIndex - 1,
    words: updatedWords,
    typedCorrectly: wasCorrect ? state.typedCorrectly - 1 : state.typedCorrectly,
  };
}