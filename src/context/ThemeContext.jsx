import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return savedTheme || 'cyberpunk';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old theme classes/attributes if any
        root.removeAttribute('data-theme');

        // Set new theme
        root.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const themes = [
        { id: 'cyberpunk', name: 'Cyberpunk', type: 'dark' },
        { id: 'midnight', name: 'Midnight', type: 'dark' },
        { id: 'light', name: 'Light', type: 'light' },
    ];

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
