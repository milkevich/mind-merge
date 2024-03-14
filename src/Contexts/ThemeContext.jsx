import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const ThemeContextProvider = ({ children }) => {
    const [isLightMode, setIsLightMode] = useState(() => {
        const storedDarkMode = localStorage.getItem('darkMode');
        return storedDarkMode ? JSON.parse(storedDarkMode) : false;
    });

    const toggleTheme = () => {
        setIsLightMode((prevMode) => {
            const currentMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(currentMode));
            return currentMode;
        });
    };

    useEffect(() => {
        const root = document.documentElement;
        if (isLightMode) {
            root.classList.add('light');
        } else {
            root.classList.remove('light');
        }
    }, [isLightMode]);

    return (
        <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeContextProvider;
