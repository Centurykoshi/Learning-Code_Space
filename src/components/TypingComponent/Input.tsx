"use client";

import { useContext, useEffect, useRef, useState } from 'react';
import { TypingContext } from '@/context/typing.context';
import { ProfileContext } from '@/context/profile.context';
import { TypingWords } from '@/hooks/types';
import Caret from './Caret';
import styles from './Input.module.css';

interface Props {
    words: TypingWords;
    wordIndex: number;
    charIndex: number;
}

export default function Input(props: Props) {
    const { words, wordIndex, charIndex } = props;

    const { typingStarted, typingFocused, lineHeight, setLineHeight } =
        useContext(TypingContext);

    const profileContext = useContext(ProfileContext);
    if (!profileContext) {
        throw new Error('ProfileContext must be used within a ProfileProvider');
    }
    const { profile } = profileContext;

    const [wordsOffset, setWordsOffset] = useState(0);

    const wordWrapperRef = useRef<HTMLDivElement>(null);
    const wordRef = useRef<HTMLDivElement>(null);
    const charRef = useRef<HTMLSpanElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typingStarted) hiddenInputRef.current?.focus();
    }, [typingStarted]);

    useEffect(() => {
        if (!wordWrapperRef.current) return;
        const { offsetTop, clientHeight } = wordWrapperRef.current;
        setWordsOffset(Math.max(offsetTop - clientHeight, 0));
    }, [charIndex]);

    const firstWord = words[0]?.chars.join('');

    useEffect(() => {
        setLineHeight((state) => wordWrapperRef.current?.clientHeight || state);

        const interval = setInterval(function () {
            setLineHeight((state) => {
                if (state === 0 || wordWrapperRef.current?.clientHeight !== state) {
                    return wordWrapperRef.current?.clientHeight || state;
                }

                clearInterval(interval);
                return state;
            });
        }, 200);

        return () => {
            clearInterval(interval);
        };
    }, [profile.customize.fontSize, setLineHeight]);

    return (
        <div className={styles.wrapper} style={{ height: lineHeight * 3 }}>
            {words.length !== 0 && profile.customize.caretStyle !== 'off' && (
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
                className={`${styles.hiddenInput} ${typingFocused ? styles.hiddenInputNocursor : ''
                    }`}
                autoCapitalize="off"
                ref={hiddenInputRef}
                tabIndex={-1}
            />
            <div
                className={styles.words}
                style={{
                    transform: typingStarted
                        ? `translateY(-${wordsOffset}px)`
                        : undefined,
                    fontSize: profile.customize.fontSize,
                }}
            >
                {words.map((word, index) => {
                    const isCurrentWord = index === wordIndex;

                    return (
                        <div
                            key={index}
                            className={styles.wordWrapper}
                            ref={isCurrentWord ? wordWrapperRef : undefined}
                        >
                            <div
                                className={`${styles.word} ${word.isIncorrect ? styles.wordIncorrect : ''
                                    }`}
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
    );
}