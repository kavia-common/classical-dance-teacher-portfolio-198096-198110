import axios from 'axios';

let axiosInstance;

/**
 * Internal helper to read env values without React hooks.
 */
function getEnvValues() {
  const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
  const logLevel = process.env.REACT_APP_LOG_LEVEL || 'info';
  return { apiBase, logLevel };
}

// PUBLIC_INTERFACE
export function getApiClient() {
  /** Returns a singleton axios client configured with base URL and interceptors. */
  if (axiosInstance) return axiosInstance;

  const { apiBase, logLevel } = getEnvValues();

  const instance = axios.create({
    baseURL: apiBase || '/',
    timeout: 15000,
  });

  instance.interceptors.request.use((config) => {
    // Extend: add auth header if needed
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (logLevel !== 'silent') {
        // eslint-disable-next-line no-console
        console.error('API Error', error?.response || error);
      }
      return Promise.reject(error);
    }
  );

  axiosInstance = instance;
  return instance;
}
