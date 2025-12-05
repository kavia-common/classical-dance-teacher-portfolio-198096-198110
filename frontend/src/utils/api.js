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
  /**
   * Fetch from API respecting API base.
   * - Returns parsed JSON for application/json responses; otherwise returns text.
   * - Throws Error on non-2xx with response status and best-effort detail.
   */
  const base = getApiBase();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const init = {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/json',
      // default content-type; callers may override or remove for multipart
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body:
      options.body instanceof FormData
        ? options.body // let browser set multipart boundary
        : options.body
        ? typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
    credentials: options.credentials || 'include',
    mode: options.mode || 'cors',
  };

  // If FormData is used, remove explicit content-type to allow correct boundary
  if (init.body instanceof FormData && init.headers['Content-Type']) {
    try {
      delete init.headers['Content-Type'];
    } catch {}
  }

  const resp = await fetch(url, init);

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    let detail = text;
    try {
      const maybe = JSON.parse(text);
      // Accept common shapes { error, message }
      detail = maybe.error || maybe.message || detail;
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

/**
 * PUBLIC_INTERFACE
 * getAdminToken - Read admin token from localStorage.
 */
export function getAdminToken() {
  try {
    return localStorage.getItem('ADMIN_TOKEN') || '';
  } catch {
    return '';
  }
}

/**
 * PUBLIC_INTERFACE
 * setAdminToken - Persist admin token to localStorage.
 */
export function setAdminToken(token) {
  try {
    if (!token) {
      localStorage.removeItem('ADMIN_TOKEN');
    } else {
      localStorage.setItem('ADMIN_TOKEN', token);
    }
  } catch {
    // ignore persistence errors
  }
}

/**
 * PUBLIC_INTERFACE
 * buildHeaders - Compose headers for authenticated admin requests.
 * @param {object} base Optional base headers
 * @param {boolean} includeContentType Whether to include JSON content-type (default true)
 * @returns {object} headers
 */
export function buildHeaders(base = {}, includeContentType = true) {
  const headers = {
    ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
    Accept: 'application/json',
    ...base,
  };
  const token = getAdminToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * PUBLIC_INTERFACE
 * showToast - Fire a lightweight global toast event for UI notifications.
 * Consumers listen to 'app:toast' on window to display toasts.
 * @param {string} message Message to show
 * @param {'success'|'error'|'info'} type Toast type
 */
export function showToast(message, type = 'info') {
  try {
    const evt = new CustomEvent('app:toast', {
      detail: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        message,
        type,
      },
    });
    window.dispatchEvent(evt);
  } catch {
    // no-op in non-DOM env
  }
}

/**
 * PUBLIC_INTERFACE
 * confirmAction - Ask user to confirm an action with a native confirm dialog.
 * Returns a Promise<boolean> for ergonomic async/await usage.
 */
export function confirmAction(message = 'Are you sure?') {
  return new Promise((resolve) => {
    try {
      // eslint-disable-next-line no-alert
      const ok = window.confirm(message);
      resolve(!!ok);
    } catch {
      resolve(false);
    }
  });
}
