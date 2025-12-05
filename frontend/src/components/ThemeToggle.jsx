import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

/**
 * PUBLIC_INTERFACE
 * ThemeToggle button that toggles between light/dark themes.
 * - Uses accessible label and keyboard operability
 */
export default function ThemeToggle({ withLabel = false }) {
  const { effectiveTheme, toggleTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--button-bg)',
        color: 'var(--button-fg)',
        border: '1px solid var(--border)',
        padding: '0.35rem 0.6rem',
        borderRadius: 999,
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'background-color .2s ease, color .2s ease, border-color .2s ease',
      }}
    >
      <span aria-hidden="true" style={{ display: 'inline-block', width: 18, height: 18 }}>
        {isDark ? (
          // Sun icon
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.79-1.79 1.41 1.41-1.79 1.8-1.41-1.42zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zM4 13H1v-1h3v1zm22 0h-3v-1h3v1zM6.76 19.16l-1.8 1.79-1.41-1.41 1.79-1.8 1.42 1.42zm12.02 1.79l-1.79-1.8 1.41-1.41 1.8 1.79-1.42 1.42zM12 18a6 6 0 110-12 6 6 0 010 12z" />
          </svg>
        ) : (
          // Moon icon
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.64 13.02A9 9 0 0111 2a9 9 0 1010.64 11.02z" />
          </svg>
        )}
      </span>
      {withLabel ? <span>{isDark ? 'Light' : 'Dark'}</span> : null}
    </button>
  );
}
