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
    const wordRef = useRef<HTMLDivElement>();
    const charRef = useRef<HTMLSpanElement>();
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typingStarted) hiddenInputRef.current?.focus();

    }, [typingStarted]);

    useEffect(() => {
        if (!wordWrapperRef.current) return;
        const { offsetTop, offsetHeight } = wordWrapperRef.current;
        setWordsOffset(Math.max(offsetTop - offsetHeight, 0));
    }, [charIndex]);


    const firstWord = words[0]?.chars.join('');

    useEffect(() => {
        setLineHeight((state) => wordWrapperRef.current?.clientHeight || state);

        const interval = setInterval(() => {
            setLineHeight((state) => {
                if (state === 0 || wordWrapperRef.current?.clientHeight !== state) {
                    return wordWrapperRef.current?.clientHeight || state;
                }

                clearInterval(interval);
                return state;
            });
        }, 200);

        return () => clearInterval(interval);
    }, [setLineHeight]); // no dependencies, runs only on mount


    return (
        <div className="overflow-hidden  p-4 rounded-lg " style={{ height: lineHeight * 3 || 'auto' }}>
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
                spellCheck={false}
                autoComplete="off"
            />
            <div className="flex flex-wrap select-none duration-75 "
                style={{ transform: typingStarted ? `translateY(-${wordsOffset}px)` : undefined }}>

                {words.map((word, index) => {
                    const isCurrentWord = index === wordIndex;

                    return (
                        <div
                            key={index}
                            className="pl-1 pr-1"
                            ref={isCurrentWord ? wordWrapperRef : undefined}
                        >
                            <div
                                className={cn("flex flex-wrap duration-75 relative", word.isIncorrect ? styles.wordIncorrect : '')}
                                ref={(node) => {
                                    if (isCurrentWord) wordRef.current = node || undefined;
                                }}

                            >
                                {word.chars.map((char, index) => (
                                    <span
                                        key={index}
                                        className={`${styles.char} ${char.type !== 'none' ? styles[`char${char.type.charAt(0).toUpperCase() + char.type.slice(1)}`] : ''
                                            }`}
                                        ref={(node) => {
                                            if (isCurrentWord && index === charIndex) {
                                                charRef.current = node || undefined;
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