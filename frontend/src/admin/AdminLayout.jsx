import React, { useEffect, useState } from 'react';
import { useAdminToken } from './AdminTokenContext';
import { showToast } from '../utils/api';

// PUBLIC_INTERFACE
/** AdminLayout wraps admin pages with a shared header and token settings control. */
export default function AdminLayout({ children, active = '' }) {
  const { token, setToken } = useAdminToken();
  const [editingToken, setEditingToken] = useState(false);
  const [draft, setDraft] = useState(token || '');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setDraft(token || '');
  }, [token]);

  useEffect(() => {
    const handler = (e) => {
      const t = e.detail;
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3000);
    };
    window.addEventListener('app:toast', handler);
    return () => window.removeEventListener('app:toast', handler);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#ffffffcc',
          backdropFilter: 'saturate(180%) blur(6px)',
          borderBottom: '1px solid #e5e7eb',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" style={{ fontWeight: 700, color: '#2563EB' }}>← Site</a>
          <strong style={{ color: '#111827' }}>Admin</strong>
          <nav aria-label="Admin">
            <ul style={{ display: 'flex', gap: 10, listStyle: 'none', margin: 0, padding: 0 }}>
              <li>
                <a
                  href="/admin"
                  style={{
                    color: active === 'home' ? '#F59E0B' : '#2563EB',
                    fontWeight: active === 'home' ? 700 : 500,
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/admin/bookings"
                  style={{
                    color: active === 'bookings' ? '#F59E0B' : '#2563EB',
                    fontWeight: active === 'bookings' ? 700 : 500,
                  }}
                >
                  Bookings
                </a>
              </li>
              <li>
                <a
                  href="/admin/gallery"
                  style={{
                    color: active === 'gallery' ? '#F59E0B' : '#2563EB',
                    fontWeight: active === 'gallery' ? 700 : 500,
                  }}
                >
                  Gallery
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setEditingToken((v) => !v)}
            title="Set admin token"
            style={{
              background: '#2563EB',
              color: '#fff',
              border: 'none',
              padding: '0.4rem 0.7rem',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {editingToken ? 'Close' : 'Settings'}
          </button>
        </div>
      </header>

      {editingToken && (
        <section
          style={{
            margin: '1rem auto 0',
            maxWidth: 900,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '1rem',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#2563EB' }}>Admin Token</h3>
          <p style={{ color: '#374151', marginTop: 0 }}>Set the admin token used for authenticated admin requests.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Enter ADMIN_TOKEN"
              style={{
                flex: 1,
                minWidth: 220,
                padding: '0.5rem 0.75rem',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                outlineColor: '#2563EB',
              }}
            />
            <button
              type="button"
              onClick={() => {
                setToken(draft.trim());
                showToast('Admin token updated', 'success');
              }}
              style={{
                background: '#F59E0B',
                color: '#111827',
                border: 'none',
                padding: '0.5rem 0.9rem',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Save
            </button>
          </div>
        </section>
      )}

      <main style={{ maxWidth: 1100, margin: '1rem auto', padding: '0 1rem 2rem' }}>{children}</main>

      {/* Toasts */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          right: 10,
          bottom: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 50,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              background: '#fff',
              color: '#111827',
              border:
                t.type === 'error'
                  ? '1px solid #EF4444'
                  : t.type === 'success'
                  ? '1px solid #10B981'
                  : '1px solid #e5e7eb',
              padding: '0.5rem 0.75rem',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
              minWidth: 220,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
