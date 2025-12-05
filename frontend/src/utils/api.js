/**
 * PUBLIC_INTERFACE
 * apiFetch - Wrapper around fetch that resolves API base from environment.
 *
 * Resolution order:
 * - window.REACT_APP_API_BASE (injected) or import.meta.env.VITE_API_BASE
 * - import.meta.env.REACT_APP_API_BASE
 * - import.meta.env.REACT_APP_BACKEND_URL
 * - same-origin '' (no base), which works with reverse-proxied /api or direct routes
 *
 * Ensures JSON parsing for application/json responses and throws on non-2xx.
 */
export function getApiBase() {
  const env = import.meta?.env || {};
  const inWindow = typeof window !== 'undefined' ? window : {};

  const base =
    inWindow.REACT_APP_API_BASE ||
    env.VITE_API_BASE ||
    env.REACT_APP_API_BASE ||
    env.REACT_APP_BACKEND_URL ||
    '';

  // Normalize by removing trailing slash
  return String(base).replace(/\/+$/, '');
}

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}) {
  /** Fetch JSON from API respecting API base; passes through other content types unparsed. */
  const base = getApiBase();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const resp = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
    credentials: options.credentials || 'include',
    mode: options.mode || 'cors',
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    let detail = text;
    try {
      const maybe = JSON.parse(text);
      detail = maybe.error || detail;
    } catch {}
    const e = new Error(`Request failed (${resp.status}): ${detail || resp.statusText}`);
    e.status = resp.status;
    throw e;
  }

  const ctype = resp.headers.get('content-type') || '';
  if (ctype.includes('application/json')) {
    return resp.json();
  }
  return resp.text();
}
