"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Zap, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingIcons = () => {
    const floatingIcons = [
        { icon: Sparkles, delay: 0 },
        { icon: Heart, delay: 0.5 },
        { icon: Zap, delay: 1 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingIcons.map((item, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${20 + index * 30}%`,
                        top: `${10 + index * 20}%`,
                    }}
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 3,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <item.icon className="w-6 h-6 text-muted-foreground/20" />
                </motion.div>
            ))}
        </div>
    );
};

export const AnimatedHeader = () => {
    return (
        <motion.div
            className="text-center mb-8 relative "
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <FloatingIcons />

            <motion.div
                className="relative z-10"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <motion.div
                    className="inline-flex items-center gap-2 text-foreground/80 text-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                    
                    </motion.div>
                    <span>Hi there, how can I help you today?</span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export const AnimatedFormContainer = ({ children, isFocused }: { children: React.ReactNode; isFocused: boolean }) => {
    return (
        <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <motion.form
                className="relative"
                layout
            >
                <motion.div
                    className={cn(
                        "relative border-2 p-6 rounded-2xl bg-background/10 backdrop-blur-sm transition-all duration-300",
                        isFocused
                            ? "border-primary/50 shadow-lg shadow-primary/60 bg-background/10"
                            : "border-border/50 hover:border-border"
                    )}
                    animate={{
                        scale: isFocused ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* Animated border glow */}
                    <AnimatePresence>
                        {isFocused && (
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                style={{ zIndex: -1 }}
                            />
                        )}
                    </AnimatePresence>

                    {children}
                </motion.div>
            </motion.form>
        </motion.section>
    );
};

export const AnimatedTextarea = ({ field, onFocus, onBlur }: {
    field: any;
    onFocus: () => void;
    onBlur: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0 }}
        >
            <textarea
                {...field}
                onFocus={onFocus}
                onBlur={onBlur}
                rows={2}
                className="w-full resize-none border-none bg-transparent text-foreground placeholder-muted-foreground/60 outline-none text-lg leading-relaxed"
                placeholder="Type your message here..."
            />
        </motion.div>
    );
};

export const TypingIndicator = ({ isTyping }: { isTyping: boolean }) => {
    return (
        <AnimatePresence>
            {isTyping && (
                <motion.div
                    className="flex items-center gap-2 text-muted-foreground/60 text-sm mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        ✨
                    </motion.div>
                    <span>Crafting your message...</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const AnimatedBottomBar = ({
    charCount,
    isTyping,
    isPending,
    onSubmit
}: {
    charCount: number;
    isTyping: boolean;
    isPending: boolean;
    onSubmit: () => void;
}) => {
    return (
        <motion.div
            className="flex gap-x-4 items-center justify-between pt-4 mt-4 border-t border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            <div className="flex items-center gap-4">
                <motion.kbd
                    className="inline-flex h-6 select-none items-center gap-1.5 rounded-md border border-border/60 bg-muted/50 px-2 font-mono text-xs font-medium text-muted-foreground"
                    whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--muted))" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <span>⏎</span> Send
                </motion.kbd>

                <AnimatePresence>
                    {charCount > 0 && (
                        <motion.div
                            className={cn(
                                "text-xs font-mono",
                                charCount > 4000 ? "text-destructive" : "text-muted-foreground"
                            )}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            {charCount}/5000
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatedSubmitButton
                isTyping={isTyping}
                isPending={isPending}
                onSubmit={onSubmit}
            />
        </motion.div>
    );
};

export const AnimatedSubmitButton = ({
    isTyping,
    isPending,
    onSubmit
}: {
    isTyping: boolean;
    isPending: boolean;
    onSubmit: () => void;
}) => {
    return (
        <motion.button
            type="submit"
            disabled={isPending || !isTyping}
            className={cn(
                "relative overflow-hidden rounded-full p-3 transition-all duration-200",
                "bg-primary text-primary-foreground shadow-lg",
                "hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            )}
            whileHover={{ scale: isTyping ? 1.1 : 1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
                rotate: isPending ? 360 : 0,
            }}
            transition={{
                rotate: { duration: 1, repeat: isPending ? Infinity : 0, ease: "linear" },
                scale: { type: "spring", stiffness: 400, damping: 10 }
            }}
            onClick={onSubmit}
        >
            <AnimatePresence mode="wait">
                {isPending ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.15 }}
                        
                    >
                        <Sparkles className="w-5 h-5 text-secondary-foreground" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="send"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Send className="w-5 h-5 cursor-pointer" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Button glow effect */}
            {isTyping && !isPending && (
                <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            )}
        </motion.button>
    );
};
