"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "./redux-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </ReduxProvider>
    );
}