"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './Input.module.css';

interface CaretProps {
    lineHeight: number;
    wordIndex: number;
    charIndex: number;
    wordsOffset: number;
    firstWord: string;
    wordRef: React.MutableRefObject<HTMLDivElement | null>;
    charRef: React.MutableRefObject<HTMLSpanElement | null>;
}

export default function Caret(props: CaretProps) {
    const { lineHeight, wordIndex, charIndex, wordsOffset, firstWord, wordRef, charRef } = props;

    const [caretPosition, setCaretPosition] = useState({ left: 0, top: 0 });
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible((prev) => !prev);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (charRef.current) {
            const rect = charRef.current.getBoundingClientRect();
            const parentRect = charRef.current.offsetParent?.getBoundingClientRect();

            if (parentRect) {
                setCaretPosition({
                    left: rect.left - parentRect.left,
                    top: rect.top - parentRect.top - wordsOffset
                });
            }
        } else if (wordRef.current) {
            const rect = wordRef.current.getBoundingClientRect();
            const parentRect = wordRef.current.offsetParent?.getBoundingClientRect();

            if (parentRect) {
                setCaretPosition({
                    left: rect.right - parentRect.left,
                    top: rect.top - parentRect.top - wordsOffset
                });
            }
        }
    }, [wordIndex, charIndex, wordsOffset, charRef, wordRef]);

    return (
        <div
            className={`${styles.caret} ${isVisible ? styles.caretVisible : styles.caretHidden}`}
            style={{
                left: caretPosition.left,
                top: caretPosition.top,
                height: lineHeight
            }}
        />
    );
}