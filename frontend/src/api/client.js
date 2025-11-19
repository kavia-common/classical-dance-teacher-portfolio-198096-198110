const getEnv = (key, fallback = "") => {
  try {
    // create-react-app exposes env vars prefixed with REACT_APP_
    return process.env[key] ?? fallback;
  } catch {
    return fallback;
  }
};

// Build base URL: prefer REACT_APP_API_BASE then fallback to REACT_APP_BACKEND_URL
const API_BASE =
  getEnv("REACT_APP_API_BASE") ||
  getEnv("REACT_APP_BACKEND_URL") ||
  "";

// PUBLIC_INTERFACE
export function buildApiUrl(path) {
  /** Build full API URL from base and path, handling leading/trailing slashes. */
  const base = API_BASE.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

// PUBLIC_INTERFACE
export async function fetchGallery(signal) {
  /** Fetch gallery items from backend /api/gallery. */
  const url = buildApiUrl("/api/gallery/");
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`Gallery request failed: ${res.status} ${res.statusText} ${text}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}
