import React from 'react';
import AdminLayout from './AdminLayout';

// PUBLIC_INTERFACE
/** Admin landing page showing simple cards linking to sections. */
export default function AdminHome() {
  return (
    <AdminLayout active="home">
      <section
        style={{
          marginTop: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        <a
          href="/admin/bookings"
          onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/admin/bookings'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          style={{
            display: 'block',
            padding: '1rem',
            border: '1px solid var(--border)',
            borderRadius: 12,
            background: 'var(--surface)',
            color: 'var(--text)',
            textDecoration: 'none',
            boxShadow: 'var(--section-shadow)',
          }}
        >
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Bookings</h3>
          <p style={{ marginBottom: 0, color: 'var(--muted)' }}>View and update booking status and notes.</p>
        </a>
        <a
          href="/admin/gallery"
          onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/admin/gallery'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          style={{
            display: 'block',
            padding: '1rem',
            border: '1px solid var(--border)',
            borderRadius: 12,
            background: 'var(--surface)',
            color: 'var(--text)',
            textDecoration: 'none',
            boxShadow: 'var(--section-shadow)',
          }}
        >
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Gallery</h3>
          <p style={{ marginBottom: 0, color: 'var(--muted)' }}>Manage gallery items: add, edit, and delete.</p>
        </a>
      </section>
    </AdminLayout>
  );
}
