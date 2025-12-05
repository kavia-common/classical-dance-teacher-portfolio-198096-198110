import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
export default defineConfig(() => {
  const requiredHost = 'vscode-internal-22306-beta.beta01.cloud.kavia.ai';

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
