"use client";
import React, { useState, useEffect } from "react";
import { MarkdownRenderer } from "./MarkdownRender";

interface TypewriterTextProps {
    content: string;
    speed?: number;
    className?: string;
    isMarkdown?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    content,
    speed = 30,
    className = "",
    isMarkdown = false
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < content.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + content[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        }
    }, [currentIndex, content, speed]);

    // Reset when content changes
    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
    }, [content]);

    if (isMarkdown) {
        return (
            <div className={className}>
                <MarkdownRenderer content={displayedText} className="text-sm" />
                {currentIndex < content.length && (
                    <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse" />
                )}
            </div>
        );
    }

    return (
        <div className={className}>
            <p className="text-sm leading-relaxed">
                {displayedText}
                {currentIndex < content.length && (
                    <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse" />
                )}
            </p>
        </div>
    );
};