import { useContext, useEffect, useState } from "react";
import { TypingContext } from "./context/typingContext";
import { cn } from "@/lib/utils";
import styles from './caret.module.css';

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
    const fontSize = 24; // Match 1.5rem (24px) from CSS
    const smoothCaret = true;


    const sizingstyle = (
        caretStyle === "line" ? {
            width: CharWidth / 7,
            height: 36 - fontSize * 0.2,
            left: 0,
            top: 1,
        } : {}
    ) as React.CSSProperties;


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
                y: wordOffsetTop + wordsOffset,
            });
        }

        const { offsetLeft: charOffsetLeft, offsetWidth: charOffsetWidth } = charRef.current;
        setCaretPostion({
            x: wordOffsetLeft + charOffsetLeft + charOffsetWidth,
            y: wordOffsetTop - wordsOffset,
        });
    }, [wordIndex, charIndex, wordsOffset, firstWord, wordRef, charRef, lineHeight]);

    useEffect(() => {
        setCharWidth(charRef.current?.offsetWidth || 0);
    }, [lineHeight]);


    return (
        <div
            className={cn(
                "block bg-[var(--color-muted-foreground)] w-0.5 h-8 left-0 top-0.5 absolute rounded-lg ",
                smoothCaret && "duration-100", !typingStarted ? smoothCaret ? styles.caretBlinkSmooth : styles.caretBlink : '',
            )}
            style={{
                transform: `translate(${caretPositon.x}px, ${caretPositon.y}px)`,
                ...sizingstyle,
            }}
        />
    )


}