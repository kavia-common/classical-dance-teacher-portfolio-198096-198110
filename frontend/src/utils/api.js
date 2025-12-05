//
// PUBLIC_INTERFACE
/** Minimal API client utilities for the frontend with admin token support. */
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.REACT_APP_API_BASE ||
  import.meta.env.REACT_APP_BACKEND_URL ||
  '/api';

let memoryToken = null;

/**
 * PUBLIC_INTERFACE
 * Get the configured Admin token (from memory first, then localStorage).
 */
export function getAdminToken() {
  if (memoryToken) return memoryToken;
  try {
    const t = localStorage.getItem('ADMIN_TOKEN');
    if (t) memoryToken = t;
    return t || '';
  } catch {
    return '';
  }
}

/**
 * PUBLIC_INTERFACE
 * Set/update admin token in memory and localStorage.
 */
export function setAdminToken(token) {
  memoryToken = token || '';
  try {
    if (token) localStorage.setItem('ADMIN_TOKEN', token);
    else localStorage.removeItem('ADMIN_TOKEN');
  } catch {
    // ignore storage errors (SSR or private mode)
  }
}

/**
 * PUBLIC_INTERFACE
 * Build headers including admin token if present.
 */
export function buildHeaders(extra = {}, includeJson = true) {
  const h = {};
  if (includeJson) {
    h['Content-Type'] = 'application/json';
  }
  const token = getAdminToken();
  if (token) {
    h['X-Admin-Token'] = token;
  }
  return { ...h, ...extra };
}

/**
 * PUBLIC_INTERFACE
 * Simple fetch wrapper for JSON APIs that throws on non-2xx.
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {
      // ignore
    }
    const error = new Error(msg);
    error.status = res.status;
    throw error;
  }
  // handle cases where no json body
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

/**
 * PUBLIC_INTERFACE
 * Minimal toast event bus (no external deps). Components can listen to window events.
 */
export function showToast(message, type = 'info') {
  const detail = { message, type, id: Date.now() };
  window.dispatchEvent(new CustomEvent('app:toast', { detail }));
}

/**
 * PUBLIC_INTERFACE
 * Helper: confirm action with native confirm (replaceable later).
 */
export async function confirmAction(message) {
  // eslint-disable-next-line no-alert
  return window.confirm(message);
}

export default {
  API_BASE,
  getAdminToken,
  setAdminToken,
  buildHeaders,
  apiFetch,
  showToast,
  confirmAction,
};
