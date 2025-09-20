import { error } from "console";
import { TypingState } from "../reducer";

export  function deleteKeyAction(state: TypingState): TypingState { 
    if((state.wordIndex === 0 && state.charIndex === 0) || state.dateTypingStarted === null) {
        return state;
    }

    if(state.charIndex === 0){ 
        const prevwordIndex = state.wordIndex - 1;

        const prevWordCorrectChars = state.words[prevwordIndex].isIncorrect
        ? state.words[prevwordIndex].chars.reduce((acc, char)=>{
            return char.type === 'correct' ? acc + 1 : acc; 
        }, 0) : -1; 

        return {
            ...state, 
            wordIndex: prevwordIndex,
            charIndex: state.words[prevwordIndex].chars.length,
            typedCorrectly : state.typedCorrectly + prevWordCorrectChars, 
        }; 
    }

    const updatedWords = state.words.slice(0); 
    const currentWord = updatedWords[state.wordIndex];
    const prevChar = currentWord.chars[state.charIndex - 1];

    if(currentWord.isIncorrect){ 
        currentWord.isIncorrect = false; 
    }

    let wasCorrect = false; 
    if(prevChar.type === 'extra'){ 
        currentWord.chars.pop();
    }
    else{ 
        if(prevChar.type === 'correct'){
            wasCorrect = true;
        }
        prevChar.type = 'none';

    }
    updatedWords[state.wordIndex] = currentWord;


    return { 
        ...state, 
        charIndex : state.charIndex -1, 
        words : updatedWords, 
        typedCorrectly : wasCorrect ? state.typedCorrectly - 1 : state.typedCorrectly,

    }
}