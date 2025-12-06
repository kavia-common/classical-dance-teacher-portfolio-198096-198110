import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { apiFetch, buildHeaders, showToast, confirmAction } from '../utils/api';

// PUBLIC_INTERFACE
/** Admin Gallery page to manage gallery items. */
export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', tags: '' });
  const [file, setFile] = useState(null);
  // Focal point functionality disabled: images always render fully contained.
  const [focal, setFocal] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await apiFetch(`/gallery`, {
        headers: { Accept: 'application/json' },
      });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'Failed to load gallery');
      showToast(`Load error: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  const createItem = async (e) => {
    e.preventDefault();
    try {
      if (file) {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('title', form.title?.trim() || '');
        fd.append('description', form.description?.trim() || '');
        fd.append('tags', form.tags || '');

        await apiFetch(`/admin/gallery`, {
          method: 'POST',
          body: fd, // Let browser set multipart boundaries
          // Do not set headers to allow multipart
        });
      } else {
        const payload = {
          title: form.title?.trim(),
          description: form.description?.trim(),
          imageUrl: form.imageUrl?.trim(),
          tags: form.tags
            ? form.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        };
        await apiFetch(`/admin/gallery`, {
          method: 'POST',
          headers: buildHeaders(),
          body: JSON.stringify(payload),
        });
      }

      showToast('Gallery item created', 'success');
      setForm({ title: '', description: '', imageUrl: '', tags: '' });
      setFile(null);
      await load();
    } catch (e) {
      showToast(`Create failed: ${e.message}`, 'error');
    }
  };

  const saveInline = async (id, patch) => {
    try {
      await apiFetch(`/admin/gallery/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(patch),
      });
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
      showToast('Item updated', 'success');
    } catch (e) {
      showToast(`Update failed: ${e.message}`, 'error');
    }
  };

  const remove = async (id) => {
    const ok = await confirmAction('Delete this gallery item? This cannot be undone.');
    if (!ok) return;
    try {
      await apiFetch(`/admin/gallery/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: buildHeaders({ Accept: 'application/json' }, false),
      });
      setItems((prev) => prev.filter((x) => x.id !== id));
      showToast('Item deleted', 'success');
    } catch (e) {
      showToast(`Delete failed: ${e.message}`, 'error');
    }
  };

  return (
    <AdminLayout active="gallery">
      <section
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ marginTop: 0, color: '#2563EB' }}>Create New Item</h2>
        <form onSubmit={createItem} style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr', maxWidth: 900 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>
              <div style={{ color: '#374151', marginBottom: 4 }}>Title</div>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                placeholder="Elegant mudras"
                style={input}
              />
            </label>
            <label>
              <div style={{ color: '#374151', marginBottom: 4 }}>Description</div>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Close-up of hand gestures symbolizing devotion."
                style={textarea}
              />
            </label>

            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ color: '#374151' }}>Upload Image (preferred) or provide URL</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={input}
              />
              <div style={{ color: '#6B7280', fontSize: 12, marginTop: -4 }}>If no file is selected, the Image URL below will be used.</div>
            </div>

            <label>
              <div style={{ color: '#374151', marginBottom: 4 }}>Image URL</div>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://…"
                style={input}
              />
            </label>
            <label>
              <div style={{ color: '#374151', marginBottom: 4 }}>Tags (comma separated)</div>
              <input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="performance, mudra"
                style={input}
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              style={{
                background: '#F59E0B',
                color: '#111827',
                border: 'none',
                padding: '0.6rem 0.9rem',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Create
            </button>
          </div>
        </form>
      </section>

      <section
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '1rem',
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ margin: 0, color: '#2563EB' }}>Gallery Items</h2>
        </header>

        {loading && <p style={{ color: '#6B7280' }}>Loading gallery…</p>}
        {err && !loading && <p style={{ color: '#EF4444' }}>{err}</p>}
        {empty && <p style={{ color: '#6B7280' }}>No gallery items yet.</p>}

        {!loading && items.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                  <th style={th}>ID</th>
                  <th style={th}>Title</th>
                  <th style={th}>Description</th>
                  <th style={th}>Image</th>
                  <th style={th}>Preview</th>
                  <th style={th}>Tags</th>
                  <th style={th}>Created</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={td}>{it.id}</td>
                    <td style={td}>
                      <input
                        defaultValue={it.title}
                        onBlur={(e) => {
                          const val = e.target.value;
                          if (it.title !== val) saveInline(it.id, { title: val });
                        }}
                        style={input}
                      />
                    </td>
                    <td style={td}>
                      <textarea
                        defaultValue={it.description || ''}
                        onBlur={(e) => {
                          const val = e.target.value;
                          if ((it.description || '') !== val) saveInline(it.id, { description: val });
                        }}
                        style={textarea}
                      />
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 64, height: 48, display: 'grid', placeItems: 'center', background: '#f3f4f6', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                          <img
                            src={it.imageUrl}
                            alt={it.title || 'image'}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 4 }}
                          />
                        </div>
                        <input
                          defaultValue={it.imageUrl || ''}
                          onBlur={(e) => {
                            const val = e.target.value;
                            if ((it.imageUrl || '') !== val) saveInline(it.id, { imageUrl: val });
                          }}
                          style={{ ...input, minWidth: 240 }}
                        />
                      </div>
                    </td>
                    <td style={td}>
                      <div style={{ width: 96, height: 72, display: 'grid', placeItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6 }}>
                        <img
                          src={it.imageUrl}
                          alt=""
                          aria-hidden="true"
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 4 }}
                        />
                      </div>
                    </td>
                    <td style={td}>
                      <input
                        defaultValue={Array.isArray(it.tags) ? it.tags.join(', ') : (it.tags || '')}
                        onBlur={(e) => {
                          const val = e.target.value;
                          const tags = val
                            ? val
                                .split(',')
                                .map((t) => t.trim())
                                .filter(Boolean)
                            : [];
                          if ((Array.isArray(it.tags) ? it.tags.join(', ') : (it.tags || '')) !== val) {
                            saveInline(it.id, { tags });
                          }
                        }}
                        style={input}
                      />
                    </td>
                    <td style={td}>{formatDate(it.createdAt) || '-'}</td>
                    <td style={td}>
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        style={{
                          background: '#EF4444',
                          color: '#fff',
                          border: 'none',
                          padding: '0.4rem 0.6rem',
                          borderRadius: 8,
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {/* Focal editor removed: previews always contain the full image. */}
    </AdminLayout>
  );
}



const th = {
  padding: '0.6rem 0.5rem',
  borderRight: '1px solid #e5e7eb',
  fontWeight: 700,
  color: '#374151',
  whiteSpace: 'nowrap',
};

const td = {
  padding: '0.5rem',
  borderRight: '1px solid #e5e7eb',
  verticalAlign: 'top',
};

const input = {
  width: 220,
  minWidth: 160,
  padding: '0.45rem 0.6rem',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  outlineColor: '#2563EB',
};

const textarea = {
  width: 260,
  minWidth: 220,
  minHeight: 64,
  padding: '0.5rem',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  outlineColor: '#2563EB',
  resize: 'vertical',
};

function formatDate(d) {
  if (!d) return '';
  try {
    const date = new Date(d);
    return date.toLocaleString();
  } catch {
    return d;
  }
}
