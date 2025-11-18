import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Hero() {
  /** Hero section landing intro. */
  return (
    <div className="card bg-gradient-hero" style={{ padding: '2rem', overflow: 'hidden' }}>
      <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)', margin: '0 0 .5rem' }}>
            Grace in Motion: Classical Dance Teaching
          </h1>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>
            Learn the elegance and discipline of classical dance through structured classes and personalized guidance.
          </p>
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <Link to="/classes" className="btn">View Classes</Link>
            <Link to="/contact" className="btn btn-secondary">Contact</Link>
          </div>
        </div>
        <div className="card" aria-hidden="true" style={{ minHeight: 180, background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))' }} />
      </div>
    </div>
  );
}
