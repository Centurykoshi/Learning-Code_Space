import { TypingWords } from "@/hooks/types";

export function getTypingWords(words: string[]): TypingWords {
    return words.map((word: string) => ({
        isIncorrect: false,
        chars: word.split('').map((char) => ({ content: char, type: 'none' })),
    }));
}