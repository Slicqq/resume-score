import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'resume-score-theme';

function getInitialTheme(): Theme {
    try {
        const saved = localStorage.getItem(STORAGE_KEY) as Theme;
        if (saved === 'light' || saved === 'dark') return saved;
    } catch {
        // ignore
    }

    // Default to light mode as requested
    return 'light';
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

    return { theme, toggle };
}
