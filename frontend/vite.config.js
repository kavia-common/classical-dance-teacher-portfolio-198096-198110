import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * PUBLIC_INTERFACE
 * Vite configuration for the frontend app.
 * - Ensures dev server runs on host 0.0.0.0 (host: true) and port 3000.
 * - Allows the Kavia preview host to connect using server.allowedHosts to avoid host blocking.
 */
export default defineConfig(() => {
  // Host that needs to be allowed for the preview environment
  const requiredHost = 'vscode-internal-16829-beta.beta01.cloud.kavia.ai';

  const mergeAllowedHosts = (current) => {
    const list = Array.isArray(current) ? current.slice() : [];
    if (!list.includes(requiredHost)) list.push(requiredHost);
    return list;
  };

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      allowedHosts: mergeAllowedHosts([]),
    },
    preview: {
      host: true,
      port: 3000,
      allowedHosts: mergeAllowedHosts([]),
    },
  };
});
