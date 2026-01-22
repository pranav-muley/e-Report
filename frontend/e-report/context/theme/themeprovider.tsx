"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize with a function to avoid hydration mismatch
    const [theme, setThemeState] = useState<Theme>(() => {
        // This will only run on the client
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme") as Theme | null;
            return saved ?? "light";
        }
        return "light"; // Default for SSR
    });

    // Sync with the script that runs before hydration
    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme | null;
        const initial = saved ?? "light";

        // Only update if different to avoid unnecessary re-renders
        if (theme !== initial) {
            setThemeState(initial);
        }

        // Ensure the class is set (in case script didn't run)
        document.documentElement.classList.toggle("dark", initial === "dark");
    }, []); // Only run once on mount

    const setTheme = (next: Theme) => {
        setThemeState(next);
        localStorage.setItem("theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
}