import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../utils/api';

// Simple styles consistent with modern theme (light/dark support)
const containerStyle = {
  maxWidth: 900,
  margin: '0 auto',
  padding: '1rem',
};

const cardStyle = {
  background: 'var(--card-bg, #ffffff)',
  color: 'var(--text-color, #111827)',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  padding: '1rem',
  marginBottom: '1rem',
  transition: 'box-shadow .2s ease',
};

const labelStyle = { display: 'block', fontWeight: 600, marginBottom: 6 };
const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: 'var(--input-bg, #fff)',
  color: 'inherit',
};

const buttonRow = { display: 'flex', gap: 12, flexWrap: 'wrap' };
const buttonStyle = {
  padding: '0.55rem 0.9rem',
  borderRadius: 8,
  border: '1px solid transparent',
  cursor: 'pointer',
  background: '#2563EB',
  color: '#fff',
};
const outlineButton = { ...buttonStyle, background: 'transparent', color: '#2563EB', border: '1px solid #2563EB' };
const dangerButton = { ...buttonStyle, background: '#EF4444' };

function useAdminToken() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [promptVisible, setPromptVisible] = useState(!token);
  const [error, setError] = useState('');

  const save = (t) => {
    const val = (t || '').trim();
    if (!val) {
      setError('Please enter a token.');
      return;
    }
    localStorage.setItem('admin_token', val);
    setToken(val);
    setPromptVisible(false);
    setError('');
  };

  const clear = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setPromptVisible(true);
  };

  return { token, save, clear, promptVisible, setPromptVisible, error, setError };
}

export default function AdminGallery() {
  const { token, save, clear, promptVisible, setPromptVisible, error, setError } = useAdminToken();

  const [items, setItems] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [newItem, setNewItem] = useState({ title: '', description: '', imageUrl: '', tags: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load public gallery for preview/reference
  const loadPublic = async () => {
    try {
      const data = await apiRequest('/api/gallery');
      setItems(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPublic();
  }, []);

  // Handle 401 centrally
  const handleRequest = async (fn) => {
    try {
      setStatusMsg('');
      setLoading(true);
      await fn();
      await loadPublic();
      setStatusMsg('Operation completed.');
    } catch (e) {
      if (e.status === 401) {
        setStatusMsg('Unauthorized. Please enter a valid admin token.');
        setPromptVisible(true);
      } else {
        setStatusMsg(e.message || 'Operation failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async () => {
    await handleRequest(async () => {
      if (file) {
        const form = new FormData();
        form.append('image', file);
        if (newItem.title) form.append('title', newItem.title);
        if (newItem.description) form.append('description', newItem.description);
        if (newItem.tags) form.append('tags', newItem.tags);

        await apiRequest('/api/admin/gallery', {
          method: 'POST',
          body: form,
          isAdmin: true,
          headers: {}, // fetch will set content-type automatically for FormData
        });
      } else {
        await apiRequest('/api/admin/gallery', {
          method: 'POST',
          isAdmin: true,
          body: {
            title: newItem.title,
            description: newItem.description,
            imageUrl: newItem.imageUrl,
            tags: newItem.tags,
          },
        });
      }
      setNewItem({ title: '', description: '', imageUrl: '', tags: '' });
      setFile(null);
    });
  };

  const onUpdate = async (id, patch) => {
    await handleRequest(async () => {
      await apiRequest(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        isAdmin: true,
        body: patch,
      });
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await handleRequest(async () => {
      await apiRequest(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        isAdmin: true,
      });
    });
  };

  const tokenPrompt = (
    <div style={{ ...cardStyle, border: '1px dashed #93c5fd' }} aria-live="polite">
      <h2 style={{ marginTop: 0 }}>Admin Access</h2>
      <p style={{ marginTop: 0, marginBottom: 12 }}>
        Enter the admin token to manage gallery items. This token is stored locally in your browser.
      </p>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="admin-token" style={labelStyle}>Admin Token</label>
        <input
          id="admin-token"
          type="password"
          autoComplete="current-password"
          aria-describedby="admin-token-help"
          placeholder="Enter admin token"
          style={inputStyle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              save(e.currentTarget.value);
            }
          }}
        />
        <div id="admin-token-help" style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
          Your token is only used to authorize requests and never sent anywhere else.
        </div>
        {error ? <div style={{ color: '#EF4444', marginTop: 6 }}>{error}</div> : null}
      </div>
      <div style={buttonRow}>
        <button
          type="button"
          onClick={() => {
            const input = document.getElementById('admin-token');
            save(input ? input.value : '');
          }}
          style={buttonStyle}
        >
          Save token
        </button>
        {token ? (
          <button type="button" onClick={clear} style={outlineButton} aria-label="Clear saved token">
            Logout / Clear token
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <main style={containerStyle}>
      <h1 style={{ marginTop: 0 }}>Admin Gallery</h1>
      {statusMsg ? (
        <div role="status" aria-live="polite" style={{ margin: '0 0 12px', color: '#2563EB' }}>
          {statusMsg}
        </div>
      ) : null}

      {promptVisible ? tokenPrompt : (
        <div style={{ ...cardStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h2 style={{ margin: 0 }}>Create new item</h2>
            <button type="button" onClick={clear} style={outlineButton}>Logout</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <div>
              <label htmlFor="title" style={labelStyle}>Title</label>
              <input id="title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="tags" style={labelStyle}>Tags (comma separated)</label>
              <input id="tags" value={newItem.tags} onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="description" style={labelStyle}>Description</label>
              <textarea id="description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} style={{ ...inputStyle, minHeight: 90 }} />
            </div>
            <div>
              <label htmlFor="imageUrl" style={labelStyle}>Image URL (if not uploading a file)</label>
              <input id="imageUrl" value={newItem.imageUrl} onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })} style={inputStyle} placeholder="https://..." />
            </div>
            <div>
              <label htmlFor="imageFile" style={labelStyle}>Or Upload Image</label>
              <input id="imageFile" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} style={inputStyle} />
            </div>
          </div>

          <div style={{ ...buttonRow, marginTop: 12 }}>
            <button type="button" onClick={onCreate} style={buttonStyle} disabled={loading}>
              {loading ? 'Saving…' : 'Create'}
            </button>
          </div>
        </div>
      )}

      <section aria-label="Gallery items preview">
        {items.length === 0 ? <p>No items yet.</p> : null}
        {items.map((it) => (
          <div key={it.id} style={cardStyle}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {it.imageUrl ? (
                <div style={{ width: 92, height: 92, display: 'grid', placeItems: 'center', background: 'var(--bg, #f3f4f6)', borderRadius: 8 }}>
                  <img
                    src={it.imageUrl}
                    alt={it.title || 'Gallery image'}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 6 }}
                  />
                </div>
              ) : null}
              <div style={{ flex: 1 }}>
                <strong>{it.title || '(No title)'}</strong>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{it.description}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(it.tags || []).map((t) => (
                    <span key={t} style={{ fontSize: 12, padding: '2px 8px', border: '1px solid #e5e7eb', borderRadius: 999 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {!promptVisible && (
              <div style={{ ...buttonRow, marginTop: 12 }}>
                <button type="button" style={outlineButton} onClick={() => onUpdate(it.id, { title: prompt('New title', it.title || '') || it.title })}>
                  Edit title
                </button>
                <button type="button" style={outlineButton} onClick={() => onUpdate(it.id, { description: prompt('New description', it.description || '') || it.description })}>
                  Edit description
                </button>
                <button type="button" style={dangerButton} onClick={() => onDelete(it.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
