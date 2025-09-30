type TypingCharType = 'correct' | 'incorrect' | 'extra' | 'none';

type TypemodeType = 'time' | 'words';

type TypingWords = {
  isIncorrect: boolean;
  chars: {
    content: string;
    type: TypingCharType;
  }[];
}[];

export type TypingResult = {
  timeline: { wpm: number; accuracy: number; raw: number; second: number }[];
  errors: number;
  testType: string | null;
  quoteAuthor?: string;
  date?: Date;
};

export function getTypingResults(
  typed: number,
  typedCorrectly: number,
  mistype: number,
  timeTook: number
): { wpm: number; raw: number; accuracy: number } {
  const timeTookInMin = timeTook / 60000;

  return {
    wpm: Math.round(typedCorrectly / 5 / timeTookInMin),
    accuracy: Math.max(Number((((typed - mistype) / typed) * 100).toFixed(2)), 0),
    raw: Math.round(typed / 5 / timeTookInMin),
  };
}

export type { TypingCharType, TypingWords, TypemodeType };