import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Footer() {
  /** Footer with basic navigation and copyright. */
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container" role="contentinfo">
        <div className="grid grid-2">
          <div>
            <strong>Classical Dance</strong>
            <p className="text-muted">Sharing the grace of classical dance through teaching and performance.</p>
          </div>
          <nav aria-label="Footer">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/classes">Classes</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <p className="text-muted" style={{ marginTop: '1rem' }}>© {year} Classical Dance</p>
      </div>
    </footer>
  );
}
