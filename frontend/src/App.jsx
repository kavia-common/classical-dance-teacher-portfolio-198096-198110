import React, { useEffect, useMemo, useState } from 'react';
import Achievements from './components/Achievements';
import Gallery from './components/Gallery';
import ClassesSchedule from './components/ClassesSchedule';
import BookingForm from './components/BookingForm';
import Modal from './components/Modal';
import { AdminTokenProvider } from './admin/AdminTokenContext';
import AdminHome from './admin/AdminHome';
import AdminBookings from './admin/AdminBookings';
import AdminGallery from './admin/AdminGallery';
import ThemeToggle from './components/ThemeToggle';

// PUBLIC_INTERFACE
/**
 * Main App component for Classical Dance Teacher Profile.
 * Modern, minimalist layout using Ocean Professional theme (blue/amber accents, subtle gradients).
 * Contains sections: About, Achievements, Gallery, Classes & Schedule, Contact.
 * Smooth in-page navigation with accessible landmarks. Responsive layout.
 */
export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const isAdmin = useMemo(() => path === '/admin' || path.startsWith('/admin/'), [path]);

  const navigate = (to) => {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
  };

  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #2563EB10 0%, var(--bg) 100%)',
        color: 'var(--text)',
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
          e.currentTarget.style.background = 'var(--primary)';
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
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px 0 var(--section-shadow)'
      }}>
        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', letterSpacing: 1.2 }}>Dr.Sowbharnika Thulasiram</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
            <li><a href="#about" style={{ color: 'var(--primary)', textDecoration: 'none' }}>About</a></li>
            <li><a href="#achievements" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Achievements</a></li>
            <li><a href="#gallery" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Gallery</a></li>
            <li><a href="#classes" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Bharatanatyam Classes</a></li>
            <li><a href="#contact" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Contact</a></li>
          </ul>
          <button
            onClick={openBooking}
            style={{
              background: 'var(--secondary)',
              color: '#111',
              border: 'none',
              padding: '0.5rem 0.9rem',
              borderRadius: 999,
              cursor: 'pointer',
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}
            aria-haspopup="dialog"
            aria-controls="booking-modal-title"
          >
            Request booking
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {!isAdmin && (
        <main id="main" role="main" style={{ maxWidth: 1100, margin: '1.25rem auto', padding: '0 1rem' }}>
          <section id="about" aria-labelledby="about-heading" style={{ margin: '2rem 0', padding: '2rem', background: 'var(--surface)', borderRadius: 12, boxShadow: 'var(--section-shadow)' }}>
            <h1 id="about-heading" style={{ color: 'var(--primary)', marginTop: 0 }}>About</h1>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
              <strong>Dr.Sowbharnika Thulasiram</strong> is a Doctor of Physical Therapy by profession
              and a Bharathanatyam dancer by passion. A dedicated disciple of 
              <strong> Dr.Vasundhara Doraswamy</strong>, she began her
              Bharathanatyam journey at the tender age of five and has continued to
              nurture her art with devotion and discipline.
            </p>
          </section>

          <Achievements />

          <Gallery />

          <ClassesSchedule />

          <section id="contact" aria-labelledby="contact-heading" style={{ margin: '2rem 0', padding: '2rem', background: 'var(--surface)', borderRadius: 12, boxShadow: 'var(--section-shadow)' }}>
            <h2 id="contact-heading" style={{ color: 'var(--primary)', marginTop: 0 }}>Contact</h2>
            <p style={{ color: 'var(--muted)' }}>
              For inquiries and bookings, use the button below or reach out directly via email/phone.
            </p>
            <button
              onClick={openBooking}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 1px 2px rgba(37,99,235,0.25)',
              }}
              aria-haspopup="dialog"
              aria-controls="booking-modal-title"
            >
              Request booking
            </button>
            <div style={{ marginTop: 12, color: 'var(--text)' }}>
              <div style={{ height: 1, background: 'var(--border)', margin: '0.75rem 0' }} />
              <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                <li>Email: <a href="mailto:Sowbharnikaram@gmail.com">Sowbharnikaram@gmail.com</a></li>
                <li>Phone: <a href="tel:+12672077324">+1 267 207 7324</a></li>
              </ul>
            </div>
          </section>
        </main>
      )}

      {isAdmin && (
        <AdminTokenProvider>
          {path === '/admin' && <AdminHome />}
          {path === '/admin/bookings' && <AdminBookings />}
          {path === '/admin/gallery' && <AdminGallery />}
        </AdminTokenProvider>
      )}

      {/* Booking Form Modal */}
      <Modal
        isOpen={bookingOpen}
        onClose={closeBooking}
        title="Request a Booking"
        labelledById="booking-modal-title"
        initialFocusSelector="form button[type='submit']"
      >
        {/* Heading for aria-labelledby */}
        <h3 id="booking-modal-title" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
          Request a Booking
        </h3>
        <BookingForm />
      </Modal>

      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        background: 'var(--footer-bg)',
        borderTop: '1px solid var(--border)',
        color: 'var(--primary)'
      }}>
        <div style={{ marginBottom: 6 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin'); }} style={{ color: 'var(--muted)' }}>
            Admin
          </a>
        </div>
        &copy; {new Date().getFullYear()} Classical Dance Teacher Portfolio
      </footer>
    </div>
  );
}
