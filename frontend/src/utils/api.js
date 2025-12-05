//
// Minimal API helper for the frontend to talk to backend,
// automatically including admin_token from localStorage for admin routes.
//

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', headers = {}, body, isAdmin = false } = {}) {
  /** Makes a request to the backend API.
   * - Adds Authorization: Bearer <admin_token> header for admin endpoints if isAdmin is true and token exists in localStorage.
   * - Parses JSON responses and throws on HTTP errors with { status, data }.
   *
   * Params:
   *   path: string - absolute or relative API path (e.g., /api/gallery)
   *   options: { method, headers, body, isAdmin }
   * Returns:
   *   Parsed JSON response or null if no body.
   */
  const baseHeaders = {
    'Accept': 'application/json',
  };

  let finalHeaders = { ...baseHeaders, ...headers };
  if (body && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  // Include admin token if requested
  if (isAdmin) {
    const token = localStorage.getItem('admin_token');
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const resp = await fetch(path, {
    method,
    headers: finalHeaders,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
    credentials: 'include',
  });

  let data = null;
  const text = await resp.text();
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
