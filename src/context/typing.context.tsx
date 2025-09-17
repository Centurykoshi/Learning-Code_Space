"use client";

import { createContext, useState } from 'react';

interface TypingContextType {
    typingStarted: boolean;
    typingFocused: boolean;
    typingDisabled: boolean;
    lineHeight: number;
    setLineHeight: React.Dispatch<React.SetStateAction<number>>;
    onTypingStarted: () => void;
    onTypingEnded: () => void;
    onTypingDisable: () => void;
    onTypingAllow: () => void;
    onUpdateTypingFocus: (bool: boolean) => void;
}

const initial: TypingContextType = {
    typingStarted: false,
    typingFocused: false,
    typingDisabled: false,
    lineHeight: 0,
    setLineHeight: () => { },
    onTypingStarted: () => { },
    onTypingEnded: () => { },
    onTypingDisable: () => { },
    onTypingAllow: () => { },
    onUpdateTypingFocus: () => { },
};

const TypingContext = createContext(initial);

interface TypingProviderProps {
    children: React.ReactNode;
}

export function TypingProvider({ children }: TypingProviderProps) {
    const [typingStarted, setTypingStarted] = useState(false);
    const [typingFocused, setTypingFocused] = useState(false);
    const [typingDisabled, setTypingDisabled] = useState(false);
    const [lineHeight, setLineHeight] = useState(0);

    const onTypingStarted = () => setTypingStarted(true);
    const onTypingEnded = () => setTypingStarted(false);
    const onTypingDisable = () => setTypingDisabled(true);
    const onTypingAllow = () => setTypingDisabled(false);
    const onUpdateTypingFocus = (bool: boolean) => setTypingFocused(bool);

    const value: TypingContextType = {
        typingStarted,
        typingFocused,
        typingDisabled,
        lineHeight,
        setLineHeight,
        onTypingStarted,
        onTypingEnded,
        onTypingDisable,
        onTypingAllow,
        onUpdateTypingFocus,
    };

    return (
        <TypingContext.Provider value={value}>
            {children}
        </TypingContext.Provider>
    );
}

export { TypingContext };