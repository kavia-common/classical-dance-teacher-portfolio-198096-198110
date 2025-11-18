import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * ThemeContext manages light/dark theme and persists preference.
 */
const ThemeContext = createContext({ theme: 'light', toggle: () => {}, setTheme: () => {} });

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  /** Provides theme state to the app. */
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Hook to access theme context. */
  return useContext(ThemeContext);
}
