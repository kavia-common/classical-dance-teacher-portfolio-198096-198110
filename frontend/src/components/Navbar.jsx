import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../providers/ThemeContext';

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with theme toggle and accessible navigation. */
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="container navbar-inner">
        <Link to="/" className="nav-brand" aria-label="Home">
          <span style={{ color: 'var(--color-primary)' }}>Classical</span> Dance
        </Link>
        <button
          className="btn btn-ghost"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <div className="nav-spacer" />
        <div
          id="primary-navigation"
          style={{ display: open ? 'flex' : 'none' }}
          className="nav-links"
          aria-label="Primary"
        >
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/classes">Classes</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        <button onClick={toggle} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}
