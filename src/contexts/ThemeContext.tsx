import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load theme preference from localStorage
  useEffect(() => {
    const loadThemePreference = () => {
      try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // If no preference is stored, check system preference
          const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDarkMode(systemPreference);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        // Fallback to system preference
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } finally {
        setLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Update theme in localStorage and apply changes
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 