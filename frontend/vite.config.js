import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// PUBLIC_INTERFACE
/** Vite config for React SPA.
 *  - Dev server binds to 0.0.0.0:3000 and does not auto-open browser.
 *  - Supports REACT_APP_* env vars from .env and exposes to import.meta.env.
 *  - (Optional proxy setup for "/api" if backend runs on different port.)
 */
export default defineConfig(({ mode }) => {
  dotenv.config({ path: '.env' });
  const defaultPort = 3000;
  const envPort = process.env.PORT ? Number(process.env.PORT) : defaultPort;
  return {
    plugins: [react()],
    server: {
      host: true,
      port: envPort,
      strictPort: true,
      open: false,
      // Uncomment below for proxy to backend:
      // proxy: {
      //   '/api': 'http://localhost:5000',
      // },
    },
    define: {
      // Expose REACT_APP_* as import.meta.env
      ...Object.entries(process.env)
        .filter(([k]) => k.startsWith('REACT_APP_'))
        .reduce((acc, [k, v]) => {
          acc[`import.meta.env.${k}`] = JSON.stringify(v);
          return acc;
        }, {}),
    },
  };
});
