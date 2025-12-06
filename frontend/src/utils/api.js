/**
 * Utilities for talking to the backend and handling admin token, headers, and UX toasts/confirm.
 * Exposes:
 *  - apiRequest: flexible fetch wrapper with optional admin Authorization header.
 *  - apiFetch: alias to apiRequest but with base path normalization for this app.
 *  - getAdminToken / setAdminToken: manage token in localStorage.
 *  - buildHeaders: merge default JSON headers with optional extras; optionally include admin auth.
 *  - confirmAction: async wrapper over window.confirm for future extensibility.
 *  - showToast: dispatch app toast events for AdminLayout to render.
 */

/* Admin token functionality removed (no-op) */
// PUBLIC_INTERFACE
export function getAdminToken() {
  /** Admin features disabled: always return empty token. */
  return '';
}

// PUBLIC_INTERFACE
export function setAdminToken(token) {
  /** Admin features disabled: ignore token set. */
  return;
}

// PUBLIC_INTERFACE
export function buildHeaders(extra = {}, includeJson = true, withAuth = false) {
  /**
   * Build request headers:
   * - includeJson: adds Accept and Content-Type for JSON requests
   * - withAuth ignored (admin removed)
   */
  const headers = { ...(includeJson ? { Accept: 'application/json', 'Content-Type': 'application/json' } : {}) };
  return { ...headers, ...(extra || {}) };
}

// PUBLIC_INTERFACE
export function showToast(message, type = 'info') {
  /** Dispatch a global toast event to be rendered by AdminLayout. */
  try {
    const event = new CustomEvent('app:toast', {
      detail: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        message,
        type, // 'info' | 'success' | 'error'
      },
    });
    window.dispatchEvent(event);
  } catch {
    // no-op on SSR or if CustomEvent not available
  }
}

// PUBLIC_INTERFACE
export async function confirmAction(message = 'Are you sure?') {
  /** Async wrapper around window.confirm to allow future custom UI. */
  try {
    // window.confirm is synchronous; wrap for consistent async usage
    return Promise.resolve(window.confirm(message));
  } catch {
    return Promise.resolve(false);
  }
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', headers = {}, body } = {}) {
  /** Makes a request to the backend API.
   * - Adds Authorization: Bearer <admin_token> header for admin endpoints if isAdmin is true and token exists in localStorage.
   * - Parses JSON responses and throws on HTTP errors with { status, data }.
   *
   * Params:
   *   path: string - absolute or relative API path
   *   options: { method, headers, body, isAdmin }
   * Returns:
   *   Parsed JSON response or null if no body.
   */
  const baseHeaders = {
    Accept: 'application/json',
  };

  let finalHeaders = { ...baseHeaders, ...(headers || {}) };
  const isForm = body && body instanceof FormData;

  // If body is not FormData and no explicit Content-Type set, default to JSON
  if (body && !isForm && !('Content-Type' in finalHeaders)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  // Admin token not supported; no Authorization header is added

  const resp = await fetch(path, {
    method,
    headers: finalHeaders,
    body: body
      ? isForm
        ? body
        : typeof body === 'string'
        ? body
        : JSON.stringify(body)
      : undefined,
    credentials: 'include',
  });

  const text = await resp.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!resp.ok) {
    const err = new Error((data && (data.error || data.message)) || `Request failed (${resp.status})`);
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}) {
  /**
   * Alias to apiRequest; normalizes common base rules if needed.
   * Currently passes through; kept for clarity and future base URL handling.
   */
  return apiRequest(path, options);
}
