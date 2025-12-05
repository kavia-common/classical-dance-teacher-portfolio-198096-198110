import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAdminToken as getStored, setAdminToken as setStored } from '../utils/api';

// PUBLIC_INTERFACE
/** Context providing admin token state and setter for admin pages. */
const AdminTokenContext = createContext({
  token: '',
  setToken: () => {},
});

export function AdminTokenProvider({ children }) {
  const [token, setTokenState] = useState('');

  useEffect(() => {
    setTokenState(getStored() || '');
  }, []);

  const setToken = useCallback((val) => {
    setStored(val || '');
    setTokenState(val || '');
  }, []);

  const value = useMemo(() => ({ token, setToken }), [token, setToken]);

  return <AdminTokenContext.Provider value={value}>{children}</AdminTokenContext.Provider>;
}

// PUBLIC_INTERFACE
/** Hook to access the Admin token context. */
export function useAdminToken() {
  return useContext(AdminTokenContext);
}

export default AdminTokenContext;
