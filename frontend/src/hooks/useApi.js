import { useCallback, useState } from 'react';

// PUBLIC_INTERFACE
export function useApi(fn) {
  /** Manage API call state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const call = useCallback(async (...args) => {
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fn(...args);
      setData(res);
      return res;
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Request failed';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { call, loading, error, data, setData };
}
