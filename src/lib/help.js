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
                y: wordOffsetTop + wordsOffset, // Changed from - to +
            });
        }

        const { offsetLeft: charOffsetLeft, clientWidth: charWidth } = charRef.current;
        setCaretPostion({
            x: wordOffsetLeft + charOffsetLeft + charWidth, // Position after the current character
            y: wordOffsetTop + wordsOffset, // Changed from - to +
        });
    }, [wordIndex, charIndex, wordsOffset, firstWord, wordRef, charRef, lineHeight]);

    useEffect(() => {
        setCharWidth(charRef.current?.clientWidth || 0);
    }, [lineHeight]);

    const sizingstyle = (
        caretStyle === "line" ? {
            width: 2, // Fixed width
            height: lineHeight || 32, // Use lineHeight or default
            left: 0,
            top: 0, // Align with text baseline
        } : {}
    ) as React.CSSProperties;

    return (
        <>
            {/* Debug info for caret positioning */}
            <div className="absolute top-0 left-0 text-xs text-red-500 z-20">
                Caret: x={caretPositon.x}, y={caretPositon.y}, started={typingStarted ? 'yes' : 'no'}
            </div>

            <div
                className={cn(
                    "absolute bg-blue-500 w-0.5",
                    smoothCaret && "transition-transform duration-100",
                    !typingStarted ? (smoothCaret ? styles.caretBlinkSmooth : styles.caretBlink) : '',
                    className
                )}
                style={{
                    transform: `translate(${caretPositon.x}px, ${caretPositon.y}px)`,
                    ...sizingstyle,
                    zIndex: 10, // Ensure caret is visible above text
                }}
            />
        </>
    );
}