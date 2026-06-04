import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'ask_me_theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const ThemeContext = createContext(null);

function getStoredTheme() {
  if (typeof window === 'undefined') return 'System';
  return localStorage.getItem(STORAGE_KEY) || 'System';
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

function resolveTheme(themeSetting) {
  if (themeSetting === 'Dark') return 'dark';
  if (themeSetting === 'Light') return 'light';
  return getSystemTheme();
}

function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [themeSetting, setThemeSetting] = useState(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState(resolveTheme(getStoredTheme()));

  useEffect(() => {
    const nextResolvedTheme = resolveTheme(themeSetting);
    setResolvedTheme(nextResolvedTheme);
    applyThemeToDocument(nextResolvedTheme);
    localStorage.setItem(STORAGE_KEY, themeSetting);
  }, [themeSetting]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const handleChange = () => {
      if (themeSetting !== 'System') return;
      const nextResolvedTheme = getSystemTheme();
      setResolvedTheme(nextResolvedTheme);
      applyThemeToDocument(nextResolvedTheme);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeSetting]);

  const value = useMemo(
    () => ({
      themeSetting,
      resolvedTheme,
      setThemeSetting,
    }),
    [themeSetting, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
