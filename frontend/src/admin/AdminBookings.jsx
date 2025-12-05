import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from './AdminLayout';
import { apiFetch, buildHeaders, showToast } from '../utils/api';

// PUBLIC_INTERFACE
/** Admin Bookings page to list and update bookings with search and pagination. */
export default function AdminBookings() {
  // Raw items fetched (when server doesn't paginate)
  const [rawItems, setRawItems] = useState([]);
  // Server items envelope (when server paginates)
  const [serverItems, setServerItems] = useState(null); // { items, total, page, pageSize }
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // UI query state
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Refs for debouncing
  const debounceRef = useRef();

  const statuses = ['all', 'pending', 'confirmed', 'cancelled'];

  // Read initial state from URL hash for navigation preservation
  useEffect(() => {
    const hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
    const hs = (hash.get('status') || 'all').toLowerCase();
    const hq = hash.get('q') || '';
    const hp = Math.max(1, parseInt(hash.get('page') || '1', 10));
    const hps = Math.min(100, Math.max(1, parseInt(hash.get('pageSize') || '10', 10)));
    setStatus(statuses.includes(hs) ? hs : 'all');
    setQ(hq);
    setPage(hp);
    setPageSize(hps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write state to URL hash
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (status && status !== 'all') sp.set('status', status);
    if (page && page !== 1) sp.set('page', String(page));
    if (pageSize && pageSize !== 10) sp.set('pageSize', String(pageSize));
    const str = sp.toString();
    const nextHash = str ? `#${str}` : '';
    if (window.location.hash !== nextHash) {
      window.history.replaceState({}, '', `${window.location.pathname}${nextHash}`);
    }
  }, [q, status, page, pageSize]);

  const load = async (opts = {}) => {
    setLoading(true);
    setErr('');
    setServerItems(null);
    try {
      // Prefer server-side params if supported.
      const params = new URLSearchParams();
      if (status && status !== 'all') params.set('status', status);
      if ((opts.q ?? q)?.trim()) params.set('q', (opts.q ?? q).trim());
      params.set('page', String(opts.page ?? page));
      params.set('pageSize', String(opts.pageSize ?? pageSize));

      const query = params.toString();
      const data = await apiFetch(`/admin/bookings${query ? `?${query}` : ''}`, {
        headers: buildHeaders(),
      });

      // Accept both array and envelope responses for backward compatibility
      if (Array.isArray(data)) {
        setRawItems(data);
        setServerItems(null);
      } else if (data && typeof data === 'object' && Array.isArray(data.items)) {
        setServerItems({
          items: data.items,
          total: Number.isFinite(data.total) ? data.total : data.items.length,
          page: Number.isFinite(data.page) ? data.page : 1,
          pageSize: Number.isFinite(data.pageSize) ? data.pageSize : data.items.length,
        });
        setRawItems([]); // not used when server items present
      } else if (data && Array.isArray(data.items)) {
        // envelope without meta
        setServerItems({
          items: data.items,
          total: data.items.length,
          page: 1,
          pageSize: data.items.length,
        });
        setRawItems([]);
      } else {
        setRawItems([]);
        setServerItems({ items: [], total: 0, page: 1, pageSize: pageSize });
      }
    } catch (e) {
      setErr(e.message || 'Failed to load bookings');
      showToast(`Load error: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load on first mount and when status changes; also when page/pageSize changes (for server-side)
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, pageSize]);

  // Debounce search input to reduce requests
  const onSearchChange = (val) => {
    setQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1); // reset to first page
      load({ q: val, page: 1 });
    }, 300);
  };

  // Compute filtered items and pagination client-side if server didn't handle it
  const filteredClient = useMemo(() => {
    if (serverItems) return serverItems;

    const term = q.trim().toLowerCase();
    let items = rawItems || [];
    if (status && status !== 'all') {
      items = items.filter((b) => (b.status || '').toLowerCase() === status.toLowerCase());
    }
    if (term) {
      items = items.filter((b) => {
        const hay = [
          b.name,
          b.email,
          b.phone,
          b.message,
          b.notes,
          b.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(term);
      });
    }
    const total = items.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = items.slice(start, end);
    return { items: pageItems, total, page, pageSize };
  }, [serverItems, rawItems, q, status, page, pageSize]);

  const empty = useMemo(() => !loading && (filteredClient?.items?.length || 0) === 0, [loading, filteredClient]);

  const totalPages = Math.max(1, Math.ceil((filteredClient?.total || 0) / (filteredClient?.pageSize || pageSize)));

  const updateBooking = async (id, patch) => {
    try {
      await apiFetch(`/admin/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: buildHeaders(),
        body: JSON.stringify(patch),
      });
      showToast('Booking updated', 'success');
      // Optimistically update local state
      const merge = (x) => (x.id === id ? { ...x, ...patch } : x);
      if (serverItems) {
        setServerItems((prev) => (prev ? { ...prev, items: prev.items.map(merge) } : prev));
      } else {
        setRawItems((prev) => prev.map(merge));
      }
    } catch (e) {
      showToast(`Update failed: ${e.message}`, 'error');
    }
  };

  const changePage = (next) => {
    const p = Math.min(Math.max(1, next), totalPages);
    setPage(p);
  };

  const pageSizes = [5, 10, 20, 50, 100];

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

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#374151' }}>Search:</span>
            <input
              aria-label="Search bookings"
              value={q}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search name, email, phone, message, status"
              style={{
                padding: '0.45rem 0.6rem',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                outlineColor: '#2563EB',
                minWidth: 220,
              }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <span style={{ color: '#374151' }}>Status:</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
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

        <div aria-live="polite" style={{ color: '#6B7280', marginBottom: 8 }}>
          {loading ? 'Loading bookings…' : `Results: ${filteredClient?.total || 0} • Page ${filteredClient?.page || page} of ${totalPages}`}
        </div>

        {err && !loading && <p style={{ color: '#EF4444' }}>{err}</p>}
        {empty && <p style={{ color: '#6B7280' }}>No bookings found.</p>}

        {!loading && (filteredClient?.items?.length || 0) > 0 && (
          <>
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
                  {filteredClient.items.map((b) => (
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

            <div
              role="navigation"
              aria-label="Pagination"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 12,
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() => changePage(1)}
                disabled={page <= 1}
                style={pagBtn}
                aria-label="First page"
              >
                « First
              </button>
              <button
                type="button"
                onClick={() => changePage(page - 1)}
                disabled={page <= 1}
                style={pagBtn}
                aria-label="Previous page"
              >
                ‹ Prev
              </button>
              <span aria-live="polite" style={{ color: '#374151' }}>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => changePage(page + 1)}
                disabled={page >= totalPages}
                style={pagBtn}
                aria-label="Next page"
              >
                Next ›
              </button>
              <button
                type="button"
                onClick={() => changePage(totalPages)}
                disabled={page >= totalPages}
                style={pagBtn}
                aria-label="Last page"
              >
                Last »
              </button>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                <span style={{ color: '#374151' }}>Per page:</span>
                <select
                  aria-label="Results per page"
                  value={pageSize}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10) || 10;
                    setPageSize(n);
                    setPage(1);
                  }}
                  style={{
                    padding: '0.35rem 0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    outlineColor: '#2563EB',
                  }}
                >
                  {pageSizes.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </>
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

const pagBtn = {
  background: '#ffffff',
  color: '#2563EB',
  border: '1px solid #e5e7eb',
  padding: '0.35rem 0.6rem',
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
