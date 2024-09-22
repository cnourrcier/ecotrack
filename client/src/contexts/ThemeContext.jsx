import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const colorPalette = {
        primary: {
            // main: '#4caf50', // Green
            main: '#0C72A2', // Green
        },
        secondary: {
            // main: '#81c784', // Light Green
            main: '#0E7CB7', // Light Green
        },
        background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
        text: {
            primary: darkMode ? '#ffffff' : '#000000',
        },
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            ...colorPalette,
        },
    });

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};