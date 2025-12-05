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
          style={{
            display: 'block',
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            background: '#fff',
            color: '#111827',
            textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(37,99,235,0.06)',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#2563EB' }}>Bookings</h3>
          <p style={{ marginBottom: 0, color: '#374151' }}>View and update booking status and notes.</p>
        </a>
        <a
          href="/admin/gallery"
          style={{
            display: 'block',
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            background: '#fff',
            color: '#111827',
            textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(37,99,235,0.06)',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#2563EB' }}>Gallery</h3>
          <p style={{ marginBottom: 0, color: '#374151' }}>Manage gallery items: add, edit, and delete.</p>
        </a>
      </section>
    </AdminLayout>
  );
}
