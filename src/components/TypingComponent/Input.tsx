import { TypingWords } from "@/hooks/types";
import { useContext, useEffect, useRef, useState } from "react";
import { TypingContext } from "./context/typingContext";
import Caret from "./Caret";
import { cn } from "@/lib/utils";
import styles from './Input.module.css';

interface props {
    words: TypingWords;
    wordIndex: number;
    charIndex: number;
}

export default function Input(props: props) {
    const { words, wordIndex, charIndex } = props;

    const { typingStarted, typingFocused, lineHeight, setLineHeight } =
        useContext(TypingContext);

    const [wordsOffset, setWordsOffset] = useState(0);


    const wordWrapperRef = useRef<HTMLDivElement>(null);
    const wordRef = useRef<HTMLDivElement>(undefined);
    const charRef = useRef<HTMLSpanElement>(undefined);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const secondCaretWordRef = useRef<HTMLDivElement>(null);
    const secondCaretCharRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (typingStarted) hiddenInputRef.current?.focus();

    }, [typingStarted]);

    useEffect(() => {
        if (!wordWrapperRef.current) return;
        const { offsetTop, offsetHeight } = wordWrapperRef.current;
        setWordsOffset(Math.max(offsetTop - offsetHeight, 0));
    }, [charIndex]);


    const firstWord = words[0]?.chars.join('');

    // useEffect(() => {
    //     setLineHeight((state) => wordWrapperRef.current?.offsetHeight || state);

    //     const interval = setInterval(function () {
    //         setLineHeight((state) => {
    //             if (state === 0 || wordWrapperRef.current?.offsetHeight !== state) {
    //                 return wordWrapperRef.current?.offsetHeight || state;
    //             }

    //             clearInterval(interval);
    //             return state;
    //         });
    //     }, 200);

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [profile.customize.fontSize]);

    return (
        <div className="overflow-hidden relative" style={{ height: lineHeight * 3 || '1.5rem' }}>
            {words.length !== 0 && (
                <Caret
                    lineHeight={lineHeight}
                    wordIndex={wordIndex}
                    charIndex={charIndex}
                    wordsOffset={wordsOffset}
                    firstWord={firstWord}
                    wordRef={wordRef}
                    charRef={charRef}
                />
            )}

            <input
                type="text"
                className={cn("absolute top-0 right-0 bottom-0 left-0 opacity-0 z-2 select-none text-lg cursor-default", typingFocused ? "cursor-none" : "")}
                autoCapitalize="off"
                ref={hiddenInputRef}
                tabIndex={-1}
            />
            <div className="flex flex-wrap select-none duration-75"
                style={{ transform: typingStarted ? `translateY(-${wordsOffset}px)` : undefined }}>
                {words.map((word, index) => {
                    const isCurrentWord = index === wordIndex;

                    return (
                        <div
                            key={index}
                            className="overflow-hidden relative"
                            ref={isCurrentWord ? wordWrapperRef : undefined}
                        >
                            <div
                                className={cn("flex flex-wrap select-none duration-75", word.isIncorrect ? styles.wordIncorrect : '')}
                                ref={(node) => {
                                    if (isCurrentWord && node) wordRef.current = node;
                                }}
                            >
                                {word.chars.map((char, index) => (
                                    <span
                                        key={index}
                                        className={`${styles.char} ${char.type !== 'none' ? styles[`char${char.type.charAt(0).toUpperCase() + char.type.slice(1)}`] : ''
                                            }`}
                                        ref={(node) => {
                                            if (isCurrentWord && index === charIndex && node) {
                                                charRef.current = node;
                                            }
                                        }}
                                    >
                                        {char.content}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}

            </div>

        </div>
    )



}