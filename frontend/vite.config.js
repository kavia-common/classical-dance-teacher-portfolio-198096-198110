import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
export default defineConfig(({ mode }) => {
  // Keep existing plugins
  const plugins = [react()];

  // Required host to allow (no duplicates when merging)
  const requiredHost = 'vscode-internal-22306-beta.beta01.cloud.kavia.ai';

  // Helper to merge allowedHosts arrays without duplicates
  const mergeAllowedHosts = (current) => {
    const list = Array.isArray(current) ? current.slice() : [];
    if (!list.includes(requiredHost)) {
      list.push(requiredHost);
    }
    return list;
  };

  // Base config
  const base = {
    // Vite automatically loads .env and exposes variables prefixed with REACT_APP_
    plugins,
  };

  // Existing server config (ensure host true and port 3000, and merge allowedHosts)
  const server = {
    host: true, // equivalent to '0.0.0.0'
    port: 3000,
    allowedHosts: mergeAllowedHosts([]),
  };

  // Existing preview config (ensure host true and port 3000, and merge allowedHosts)
  const preview = {
    host: true, // equivalent to '0.0.0.0'
    port: 3000,
    allowedHosts: mergeAllowedHosts([]),
  };

  return {
    ...base,
    server,
    preview,
  };
});
