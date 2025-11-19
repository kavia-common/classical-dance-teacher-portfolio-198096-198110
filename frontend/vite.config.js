import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// PUBLIC_INTERFACE
/** Vite config for React SPA.
 *  - Dev server binds to 0.0.0.0:3000 and does not auto-open browser.
 *  - Uses PORT from .env or 3000 by default.
 *  - Exposes REACT_APP_* env vars to import.meta.env.
 */
export default defineConfig(() => {
  dotenv.config({ path: '.env' });
  const defaultPort = 3000;
  const envPort = process.env.PORT ? Number(process.env.PORT) : defaultPort;
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: envPort,
      strictPort: true,
      open: false,
    },
    define: {
      ...Object.entries(process.env)
        .filter(([k]) => k.startsWith('REACT_APP_'))
        .reduce((acc, [k, v]) => {
          acc[`import.meta.env.${k}`] = JSON.stringify(v);
          return acc;
        }, {}),
    },
  };
});
