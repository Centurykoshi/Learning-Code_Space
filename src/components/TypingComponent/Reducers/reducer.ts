import { TypingWords } from "@/hooks/types";
import { start } from "./Actions/startaction";
import { type } from "./Actions/typeaction";
import { nextWord } from "./Actions/nextWordAction";
import { deleteKeyAction } from "./Actions/deletekey.action";
import { deleteWord } from "./Actions/deleteword";
import { addwords } from "./Actions/addwords";
import { restart } from "./Actions/restartaction";
import { newWords } from "./Actions/newWords";


export type TypingState = {
    wordIndex: number;
    charIndex: number;
    words: TypingWords;
    mistyping: number;
    typed: number;
    typedCorrectly: number;
    dateTypingStarted: number | null;
}

export const initialState: TypingState = {
    wordIndex: 0,
    charIndex: 0,
    words: [],
    mistyping: 0,
    typed: 0,
    typedCorrectly: 0,
    dateTypingStarted: null,
};

export type TypingAction =
    | { type: "START"; payload: string }
    | { type: "TYPE"; payload: string }
    | { type: "NEXT_WORD" }
    | { type: "DELETE_KEY" }
    | { type: "DELETE_WORD" }
    | { type: "ADD_WORDS"; payload: TypingWords }
    | { type: "RESTART"; payload?: TypingWords }
    | { type: "TIMELINE" }
    | { type: "RESULT"; payload?: number }
    | { type: "NEW_WORDS"; payload: { words: TypingWords; author?: string } };

export default function typingReducer(
    state: TypingState,
    action: TypingAction
): TypingState {
    switch (action.type) {
        case 'START':
            return start(state, action.payload);
        case 'TYPE':
            return type(state, action.payload);
        case 'NEXT_WORD':
            return nextWord(state);
        case 'DELETE_KEY':
            return deleteKeyAction(state);
        case 'DELETE_WORD':
            return deleteWord(state);
        case 'ADD_WORDS':
            return addwords(state, action.payload);
        case 'RESTART':
            return restart(state, action.payload);
        case 'NEW_WORDS':
            return newWords(state, action.payload);
        default:
            return state;
    }
}