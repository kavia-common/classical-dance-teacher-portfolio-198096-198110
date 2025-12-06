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
  const [focal, setFocal] = useState(null); // { id, x, y } for editor overlay

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
                  <th style={th}>Focal</th>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setFocal({ id: it.id, x: it.focalPoint?.x ?? 0.5, y: it.focalPoint?.y ?? 0.5 })}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFocal({ id: it.id, x: it.focalPoint?.x ?? 0.5, y: it.focalPoint?.y ?? 0.5 }); }}
                          style={{ width: 96, height: 72, border: '1px dashed #9CA3AF', borderRadius: 6, position: 'relative', cursor: 'crosshair', background: '#f9fafb' }}
                          title="Click to edit focal point"
                        >
                          <img
                            src={it.imageUrl}
                            alt=""
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: `${((it.focalPoint?.x ?? 0.5) * 100).toFixed(1)}% ${((it.focalPoint?.y ?? 0.5) * 100).toFixed(1)}%`,
                              borderRadius: 6
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              left: `${((it.focalPoint?.x ?? 0.5) * 100).toFixed(1)}%`,
                              top: `${((it.focalPoint?.y ?? 0.5) * 100).toFixed(1)}%`,
                              transform: 'translate(-50%, -50%)',
                              width: 10,
                              height: 10,
                              background: '#2563EB',
                              borderRadius: '50%',
                              border: '2px solid white',
                              boxShadow: '0 0 0 2px rgba(37,99,235,0.4)',
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => saveInline(it.id, { focalPoint: { x: 0.5, y: 0.5 } })}
                          style={{ background: '#e5e7eb', border: 'none', padding: '0.3rem 0.5rem', borderRadius: 6, cursor: 'pointer' }}
                          title="Reset focal point"
                        >
                          Reset
                        </button>
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
      {focal && (
        <FocalEditor
          item={items.find((x) => x.id === focal.id)}
          initial={focal}
          onClose={() => setFocal(null)}
          onSave={async (pos) => {
            await saveInline(focal.id, { focalPoint: pos });
            setFocal(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

/**
 * Lightweight focal point editor overlay
 * Click on image to set normalized x/y, preview marker, save/cancel actions.
 */
function FocalEditor({ item, initial, onSave, onClose }) {
  if (!item) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <FocalCanvas item={item} initial={initial} onSave={onSave} onClose={onClose} />
    </div>
  );
}

function FocalCanvas({ item, initial, onSave, onClose }) {
  const [pos, setPos] = React.useState({ x: initial?.x ?? item.focalPoint?.x ?? 0.5, y: initial?.y ?? item.focalPoint?.y ?? 0.5 });
  const ref = React.useRef(null);

  const onPick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    setPos({ x, y });
  };

  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb', width: 'min(96vw, 900px)' }}>
      <h3 style={{ marginTop: 4, color: '#2563EB' }}>Adjust Focal Point</h3>
      <p style={{ marginTop: -6, color: '#6B7280' }}>Click on the image to set the focal point used for cropping previews.</p>
      <div
        ref={ref}
        onClick={onPick}
        style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', cursor: 'crosshair', background: '#f9fafb' }}
      >
        <img
          src={item.imageUrl}
          alt={item.title || 'image'}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover', // keep cover for cropping preview accuracy
            objectPosition: `${(pos.x * 100).toFixed(1)}% ${(pos.y * 100).toFixed(1)}%`,
            background: '#f3f4f6',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${(pos.x * 100).toFixed(1)}%`,
            top: `${(pos.y * 100).toFixed(1)}%`,
            transform: 'translate(-50%, -50%)',
            width: 14,
            height: 14,
            background: '#2563EB',
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 0 0 2px rgba(37,99,235,0.5)'
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <div style={{ color: '#374151' }}>x: {(pos.x).toFixed(3)} • y: {(pos.y).toFixed(3)}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onClose} style={{ background: '#e5e7eb', border: 'none', padding: '0.5rem 0.8rem', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={() => onSave(pos)} style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '0.5rem 0.8rem', borderRadius: 8, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
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
