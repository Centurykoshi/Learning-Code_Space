import { createContext, useEffect, useState } from "react";

interface Context {
    typingStarted: boolean;
    typingFocused: boolean;
    typingDisabled: boolean;
    lineHeight: number;
    typemodeVisible: boolean; // Fixed: was 'typemodevisible'
    setLineHeight: React.Dispatch<React.SetStateAction<number>>;
    setTypemodeVisible: React.Dispatch<React.SetStateAction<boolean>>; // Fixed: was 'setTypemodevisible'
    onTypingStarted: () => void;
    onTypingEnded: () => void;
    onTypingDisable: () => void;
    onTypingAllow: () => void;
    onUpdateTypingFocus: (focus: boolean) => void;
}

const initial: Context = {
    typingStarted: false,
    typingFocused: false,
    typingDisabled: false,
    lineHeight: 0,
    typemodeVisible: true, // Fixed: was 'typemodevisible'
    setTypemodeVisible: () => { }, // Fixed: was 'setTypemodevisible'
    setLineHeight: () => { },
    onTypingStarted: () => { },
    onTypingEnded: () => { },
    onTypingDisable: () => { },
    onTypingAllow: () => { },
    onUpdateTypingFocus: () => { },
};

const TypingContext = createContext(initial);

interface Props {
    children: React.ReactNode;
}

const TypingContextProvider = ({ children }: Props) => {
    const [typingStarted, setTypingStarted] = useState(initial.typingStarted);
    const [typingFocused, setTypingFocused] = useState(initial.typingFocused);
    const [typingDisabled, setTypingDisabled] = useState(initial.typingDisabled);
    const [lineHeight, setLineHeight] = useState(initial.lineHeight);
    const [typemodeVisible, setTypemodeVisible] = useState(initial.typemodeVisible); // Fixed: was 'typemodevisible'

    const onTypingStarted = () => setTypingStarted(true);
    const onTypingEnded = () => setTypingStarted(false);

    const onTypingDisable = () => setTypingDisabled(true);
    const onTypingAllow = () => setTypingDisabled(false);

    const onUpdateTypingFocus: Context['onUpdateTypingFocus'] = (bool) => {
        setTypingFocused(bool);
    };

    useEffect(() => {
        if (typingFocused) {
            document.documentElement.style.cursor = 'none';
        } else {
            document.documentElement.style.cursor = 'auto';
        }
    }, [typingFocused]);

    return (
        <TypingContext.Provider
            value={{
                typingStarted,
                typingFocused,
                typingDisabled,
                lineHeight,
                typemodeVisible, // Fixed: consistent naming
                setTypemodeVisible, // Fixed: consistent naming
                setLineHeight,
                onTypingStarted,
                onTypingEnded,
                onTypingDisable,
                onTypingAllow,
                onUpdateTypingFocus,
            }
            }
        >
            {children}
        </TypingContext.Provider>
    );
};

export { TypingContext, TypingContextProvider };