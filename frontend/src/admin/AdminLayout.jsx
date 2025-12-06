import React, { useEffect, useState } from 'react';
import { useAdminToken } from './AdminTokenContext';
import { showToast } from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';

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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'var(--nav-bg)',
          backdropFilter: 'saturate(180%) blur(6px)',
          borderBottom: '1px solid var(--border)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
            style={{ fontWeight: 700, color: 'var(--primary)' }}
          >
            ← Site
          </a>
          <strong style={{ color: 'var(--text)' }}>Admin</strong>
          <nav aria-label="Admin" onClick={(e) => {
            const a = e.target.closest('a[href]');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href) return;
            // Use client-side navigation within SPA
            e.preventDefault();
            window.history.pushState({}, '', href);
            // Notify App to sync path state
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}>
            <ul style={{ display: 'flex', gap: 10, listStyle: 'none', margin: 0, padding: 0 }}>
              <li>
                <a
                  href="/admin"
                  style={{
                    color: active === 'home' ? 'var(--secondary)' : 'var(--primary)',
                    fontWeight: active === 'home' ? 700 : 500,
                    textDecoration: 'none',
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/admin/bookings"
                  style={{
                    color: active === 'bookings' ? 'var(--secondary)' : 'var(--primary)',
                    fontWeight: active === 'bookings' ? 700 : 500,
                    textDecoration: 'none',
                  }}
                >
                  Bookings
                </a>
              </li>
              <li>
                <a
                  href="/admin/gallery"
                  style={{
                    color: active === 'gallery' ? 'var(--secondary)' : 'var(--primary)',
                    fontWeight: active === 'gallery' ? 700 : 500,
                    textDecoration: 'none',
                  }}
                >
                  Gallery
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setEditingToken((v) => !v)}
            title="Set admin token"
            style={{
              background: 'var(--primary)',
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
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '1rem',
          }}
        >
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Admin Token</h3>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>Set the admin token used for authenticated admin requests.</p>
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
                border: '1px solid var(--border)',
                color: 'var(--text)',
                background: 'var(--surface)',
                outlineColor: 'var(--primary)',
              }}
            />
            <button
              type="button"
              onClick={() => {
                setToken(draft.trim());
                showToast('Admin token updated', 'success');
              }}
              style={{
                background: 'var(--secondary)',
                color: 'var(--text)',
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

      <main style={{ maxWidth: 1100, margin: '1rem auto', padding: '0 1rem 2rem', color: 'var(--text)' }}>{children}</main>

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
              background: 'var(--surface)',
              color: 'var(--text)',
              border:
                t.type === 'error'
                  ? '1px solid var(--error)'
                  : t.type === 'success'
                  ? '1px solid #10B981'
                  : '1px solid var(--border)',
              padding: '0.5rem 0.75rem',
              borderRadius: 8,
              boxShadow: 'var(--section-shadow)',
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
