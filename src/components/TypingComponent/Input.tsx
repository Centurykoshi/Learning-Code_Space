import { TypingWords } from "@/hooks/types";
import React, { useContext, useEffect, useRef, useState } from "react";
import { TypingContext } from "./context/typingContext";
import Caret from "./Caret";
import { cn } from "@/lib/utils";
import styles from './Input.module.css';

interface Props {
    words: TypingWords;
    wordIndex: number;
    charIndex: number;
    fontSize: number;
}

export default function Input(props: Props) {
    const { words, wordIndex, charIndex, fontSize } = props;

    const { typingStarted, typingFocused, lineHeight, setLineHeight } =
        useContext(TypingContext);


    const [wordsOffset, setWordsOffset] = useState(0);

    const wordWrapperRef = useRef<HTMLDivElement>(null);
    const wordRef = useRef<HTMLDivElement>(undefined);
    const charRef = useRef<HTMLSpanElement>(undefined);
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
        setLineHeight((state) => wordWrapperRef.current?.offsetHeight || state);


        const interval = setInterval(() => {
            setLineHeight((state) => {

                if (state === 0 || wordWrapperRef.current?.offsetHeight !== state) {
                    return wordWrapperRef.current?.offsetHeight || state;
                }

                clearInterval(interval);
                console.log("Line Height :", lineHeight);
                return state;
            });
        }, 200);

        return () => clearInterval(interval);

    }, [fontSize]);

    console.log("First Word :", wordWrapperRef.current?.offsetHeight);
    console.log("WordIndx : " + wordIndex, " CharIndex : " + charIndex, "LineHEIGHT : " + lineHeight);

   




    return (
        <div className="overflow-hidden  relative" style={{ height: "auto" }}>
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
                className={cn(
                    "absolute top-0 right-0 bottom-0 left-0 opacity-0 z-2 select-none text-lg cursor-default",
                    typingFocused ? "cursor-none" : ""
                )}
                
                ref={hiddenInputRef}
                tabIndex={-1}
                
               
            />

            <div
                className="flex flex-wrap select-none duration-75"
                style={{ transform: typingStarted ? `translateY(-${wordsOffset}px)` : undefined, 
                fontSize : "24", 

            }}
            >
                {words.map((word, index) => {
                    const isCurrentWord = index === wordIndex;

                    return (
                        <div
                            key={index}
                            className="pl-1 pr-1"
                            ref={isCurrentWord ? wordWrapperRef : undefined}
                        >
                            <div
                                className={cn(
                                    "border-transparent-1 relative",
                                    word.isIncorrect ? styles.wordIncorrect : ''
                                )}
                                ref={(node) => {
                                    if (isCurrentWord) {
                                        wordRef.current = node || undefined;
                                    }
                                }}
                            >
                                {word.chars.map((char, charIdx) => (
                                    <span
                                        key={charIdx}
                                        className={`${styles.char} ${char.type !== 'none'
                                            ? styles[`char${char.type.charAt(0).toUpperCase() + char.type.slice(1)}`]
                                            : ''
                                            }`}
                                        ref={(node) => {
                                            if (isCurrentWord && charIdx === charIndex) {
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
    );
}