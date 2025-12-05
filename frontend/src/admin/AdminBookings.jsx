import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { apiFetch, buildHeaders, showToast } from '../utils/api';

// PUBLIC_INTERFACE
/** Admin Bookings page to list and update bookings. */
export default function AdminBookings() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const statuses = ['all', 'pending', 'confirmed', 'cancelled'];

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const qs = status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
      const data = await apiFetch(`/admin/bookings${qs}`, {
        headers: buildHeaders(),
      });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'Failed to load bookings');
      showToast(`Load error: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  const updateBooking = async (id, patch) => {
    try {
      await apiFetch(`/admin/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: buildHeaders(),
        body: JSON.stringify(patch),
      });
      showToast('Booking updated', 'success');
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    } catch (e) {
      showToast(`Update failed: ${e.message}`, 'error');
    }
  };

  return (
    <AdminLayout active="bookings">
      <section
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '1rem',
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <h2 style={{ margin: 0, color: '#2563EB' }}>Bookings</h2>
          <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#374151' }}>Filter:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                padding: '0.4rem 0.6rem',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                outlineColor: '#2563EB',
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </header>

        {loading && <p style={{ color: '#6B7280' }}>Loading bookings…</p>}
        {err && !loading && <p style={{ color: '#EF4444' }}>{err}</p>}
        {empty && <p style={{ color: '#6B7280' }}>No bookings found.</p>}

        {!loading && items.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
              }}
            >
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                  <th style={th}>ID</th>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Phone</th>
                  <th style={th}>Message/Notes</th>
                  <th style={th}>Status</th>
                  <th style={th}>Created</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={td}>{b.id}</td>
                    <td style={td}>{b.name || '-'}</td>
                    <td style={td}>{b.email || '-'}</td>
                    <td style={td}>{b.phone || '-'}</td>
                    <td style={td}>
                      <textarea
                        defaultValue={b.notes || b.message || ''}
                        onBlur={(e) => {
                          const val = e.target.value;
                          if ((b.notes || '') !== val) updateBooking(b.id, { notes: val });
                        }}
                        placeholder="Notes"
                        style={textarea}
                      />
                    </td>
                    <td style={td}>
                      <select
                        defaultValue={b.status || 'pending'}
                        onChange={(e) => updateBooking(b.id, { status: e.target.value })}
                        style={select}
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td style={td}>{formatDate(b.createdAt) || '-'}</td>
                    <td style={td}>
                      <button
                        type="button"
                        onClick={() => showToast('Saved (use controls above to update)', 'info')}
                        style={btn}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
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

const textarea = {
  width: 240,
  minWidth: 200,
  minHeight: 64,
  padding: '0.5rem',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  outlineColor: '#2563EB',
  resize: 'vertical',
};

const select = {
  padding: '0.4rem 0.5rem',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  outlineColor: '#2563EB',
};

const btn = {
  background: '#2563EB',
  color: '#fff',
  border: 'none',
  padding: '0.4rem 0.6rem',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
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
