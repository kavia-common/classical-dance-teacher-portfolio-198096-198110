import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Gallery from './components/Gallery';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('home'); // 'home' | 'gallery'

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <nav style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 12 }}>
          <button
            onClick={() => setView('home')}
            className="App-link"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            Home
          </button>
          <button
            onClick={() => setView('gallery')}
            className="App-link"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            Gallery
          </button>
        </nav>

        {view === 'home' && (
          <>
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <p>
              Current theme: <strong>{theme}</strong>
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </>
        )}

        {view === 'gallery' && (
          <div style={{ width: '100%' }}>
            <Gallery />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
