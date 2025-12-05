import React from 'react';
import Achievements from './components/Achievements';
import Gallery from './components/Gallery';
import ClassesSchedule from './components/ClassesSchedule';

// PUBLIC_INTERFACE
/**
 * Main App component for Classical Dance Teacher Profile.
 * Modern, minimalist layout using Ocean Professional theme (blue/amber accents, subtle gradients).
 * Contains sections: About, Achievements, Gallery, Classes & Schedule, Contact.
 * Smooth in-page navigation with accessible landmarks. Responsive layout.
 */
export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #2563EB10 0%, #f9fafb 100%)',
        color: '#111827',
        fontFamily: 'system-ui, sans-serif',
        scrollBehavior: 'smooth',
      }}
    >
      <a
        href="#main"
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '1rem';
          e.currentTarget.style.top = '1rem';
          e.currentTarget.style.background = '#2563EB';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.padding = '0.5rem 0.75rem';
          e.currentTarget.style.borderRadius = '8px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px';
          e.currentTarget.style.top = '-9999px';
        }}
      >
        Skip to content
      </a>

      <nav aria-label="Primary" style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backdropFilter: 'saturate(180%) blur(6px)',
        background: '#ffffffcc',
        borderBottom: '1px solid #e5e7eb',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px 0 rgba(37,99,235,0.06)'
      }}>
        <span style={{ fontWeight: 800, color: '#2563EB', fontSize: '1.1rem', letterSpacing: 1.2 }}>Dr.Sowbharnika Thulasiram</span>
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
          <li><a href="#about" style={{ color: '#2563EB', textDecoration: 'none' }}>About</a></li>
          <li><a href="#achievements" style={{ color: '#2563EB', textDecoration: 'none' }}>Achievements</a></li>
          <li><a href="#gallery" style={{ color: '#2563EB', textDecoration: 'none' }}>Gallery</a></li>
          <li><a href="#classes" style={{ color: '#2563EB', textDecoration: 'none' }}>Bharatanatyam Classes</a></li>
          <li><a href="#contact" style={{ color: '#2563EB', textDecoration: 'none' }}>Contact</a></li>
        </ul>
      </nav>

      <main id="main" role="main" style={{ maxWidth: 1100, margin: '1.25rem auto', padding: '0 1rem' }}>
        <section id="about" aria-labelledby="about-heading" style={{ margin: '2rem 0', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
          <h1 id="about-heading" style={{ color: '#2563EB', marginTop: 0 }}>About</h1>
          <p style={{ color: '#374151', lineHeight: 1.7 }}>
           
<p>
        <strong>Dr.Sowbharnika Thulasiram</strong> is a Doctor of Physical Therapy by profession
        and a Bharathanatyam dancer by passion. A dedicated disciple of 
        <strong> Dr.Vasundhara Doraswamy</strong>, she began her
        Bharathanatyam journey at the tender age of five and has continued to
        nurture her art with devotion and discipline.
      </p>
    </p>
        </section>

        <Achievements />

        <Gallery />

        <ClassesSchedule />

        <section id="contact" aria-labelledby="contact-heading" style={{ margin: '2rem 0', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
          <h2 id="contact-heading" style={{ color: '#2563EB', marginTop: 0 }}>Contact</h2>
          <p style={{ color: '#374151' }}>
            For inquiries and bookings, please reach out via email or phone. A contact form will be added soon.
          </p>
          <ul style={{ marginTop: 8, color: '#111827' }}>
            <li>Email: <a href="mailto:Sowbharnikaram@gmail.com">Sowbharnikaram@gmail.com</a></li>
            <li>Phone: <a href="tel:+12672077324">+1 267 207 7324</a></li>
          </ul>
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
