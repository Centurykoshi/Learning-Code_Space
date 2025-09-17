import { useContext, useEffect, useState } from "react";
import { TypingContext } from "./context/typingContext";
import { cn } from "@/lib/utils";
import { transform } from "zod";

interface Props {
    lineHeight: number;
    wordIndex: number;
    charIndex: number;
    wordsOffset: number;
    firstWord: string;
    wordRef: React.MutableRefObject<HTMLDivElement | undefined>;
    charRef: React.MutableRefObject<HTMLSpanElement | undefined>;
    className?: string;
}


export default function Caret(props: Props) {
    const {
        lineHeight,
        wordIndex,
        charIndex,
        wordsOffset,
        firstWord,
        wordRef,
        charRef,
        className,
    } = props;

    const { typingStarted } = useContext(TypingContext);

    const [caretPositon, setCaretPostion] = useState({ x: 0, y: 0 });
    const [CharWidth, setCharWidth] = useState(0);

    const caretStyle = 'line';
    const fontSize = 16;
    const smoothCaret = true;

    useEffect(() => {
        if (!wordRef.current) return;
        const {
            offsetLeft: wordOffsetLeft,
            offsetTop: wordOffsetTop,
            offsetWidth: wordOffsetWidth,
        } = wordRef.current;

        if (!charRef.current) {
            return setCaretPostion({
                x: wordOffsetLeft + wordOffsetWidth,
                y: wordOffsetTop - wordsOffset,
            });
        }

        const { offsetLeft: charOffsetLeft } = charRef.current;
        setCaretPostion({
            x: wordOffsetLeft + charOffsetLeft,
            y: wordOffsetTop - wordsOffset,
        });
    }, [wordIndex, charIndex, wordsOffset, firstWord, wordRef, charRef, lineHeight]);

    useEffect(() => {
        setCharWidth(charRef.current?.clientWidth || 0);
    }, [lineHeight]);

    return (
        <div
            className={cn(
                "block bg-[var(--clr-caret)] w-0.5 h-8 left-0 top-0.5",
                smoothCaret && "duration-100"
            )}
            style={{
                transform: `translate(${caretPositon.x}px, ${caretPositon.y}px)`,
            }}
        />
    )


}