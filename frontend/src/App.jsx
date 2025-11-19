import React from 'react';

// PUBLIC_INTERFACE
/**
 * Main App component for Classical Dance Teacher Profile.
 * Modern, minimalist layout using Ocean Professional theme (blue/amber accents, subtle gradients).
 */
export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #2563EB10 0%, #f9fafb 100%)',
        color: '#111827',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <nav style={{
        background: '#ffffffcc',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px 0 rgba(37,99,235,0.02)'
      }}>
        <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '1.25rem', letterSpacing: 2 }}>Classical Dance Teacher</span>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          <li><a href="#about" style={{ color: '#2563EB', textDecoration: 'none' }}>About</a></li>
          <li><a href="#achievements" style={{ color: '#2563EB', textDecoration: 'none' }}>Achievements</a></li>
          <li><a href="#gallery" style={{ color: '#2563EB', textDecoration: 'none' }}>Gallery</a></li>
          <li><a href="#classes" style={{ color: '#2563EB', textDecoration: 'none' }}>Classes & Schedule</a></li>
          <li><a href="#contact" style={{ color: '#2563EB', textDecoration: 'none' }}>Contact</a></li>
        </ul>
      </nav>

      <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
        <section id="achievements" style={{ margin: '2rem 0', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 4px #2563EB10' }}>
          <h1 style={{ color: '#2563EB', marginBottom: 4 }}>Prominent Achievements</h1>
          <p style={{ color: '#F59E0B', fontWeight: 500 }}>Highlight the greatest achievements here.</p>
        </section>
        <section id="about" style={{ margin: '2rem 0', padding: '2rem', background: '#fff', borderRadius: 12 }}>
          <h2>About</h2>
          <p>Brief bio, philosophy, and journey of the teacher (to be filled).</p>
        </section>
        <section id="gallery" style={{ margin: '2rem 0', padding: '2rem', background: '#fff', borderRadius: 12 }}>
          <h2>Gallery</h2>
          <p>Photos & videos (coming soon).</p>
        </section>
        <section id="classes" style={{ margin: '2rem 0', padding: '2rem', background: '#fff', borderRadius: 12 }}>
          <h2>Classes & Schedule</h2>
          <p>Overview and booking (to be implemented).</p>
        </section>
        <section id="contact" style={{ margin: '2rem 0', padding: '2rem', background: '#fff', borderRadius: 12 }}>
          <h2>Contact</h2>
          <p>Contact form will go here.</p>
        </section>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        color: '#2563EB'
      }}>
        &copy; {new Date().getFullYear()} Classical Dance Teacher Portfolio
      </footer>
    </div>
  );
}
