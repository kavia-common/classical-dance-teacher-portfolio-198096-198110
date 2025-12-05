import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * ThemeProvider manages light/dark mode across the app.
 * - Respects OS preference via prefers-color-scheme
 * - Persists user selection to localStorage under 'ui.theme'
 * - Toggles 'dark' class on <html> to switch CSS variables
 */
const ThemeContext = createContext({
  theme: 'system', // 'light' | 'dark' | 'system'
  // PUBLIC_INTERFACE
  /** Set theme to 'light' | 'dark' | 'system' (persisted) */
  setTheme: (_value) => {},
  // PUBLIC_INTERFACE
  /** Toggle between light and dark (ignores 'system' by resolving it first) */
  toggleTheme: () => {},
  // PUBLIC_INTERFACE
  /** Returns the effective theme after resolving 'system' -> 'light' | 'dark' */
  effectiveTheme: 'light',
});

const STORAGE_KEY = 'ui.theme';

function getSystemPrefersDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyHtmlClass(themeValue) {
  const root = document.documentElement;
  const prefersDark = getSystemPrefersDark();
  const isDark = themeValue === 'dark' || (themeValue === 'system' && prefersDark);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  });

  // compute effective theme
  const effectiveTheme = useMemo(() => {
    if (theme === 'system') {
      return getSystemPrefersDark() ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  // Apply class on html on load and whenever theme or OS preference changes
  useEffect(() => {
    applyHtmlClass(theme);
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        applyHtmlClass('system');
      }
    };
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
    };
  }, [theme]);

  const setTheme = useCallback((value) => {
    const next = value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    const resolved = effectiveTheme;
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  }, [effectiveTheme, setTheme]);

  const ctx = useMemo(() => ({ theme, setTheme, toggleTheme, effectiveTheme }), [theme, setTheme, toggleTheme, effectiveTheme]);

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
/** Hook to access theme context */
export function useTheme() {
  return useContext(ThemeContext);
}
