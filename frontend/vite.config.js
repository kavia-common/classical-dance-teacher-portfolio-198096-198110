import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/**
 * Vite config for Classical Dance Teacher Profile frontend.
 * - Dev and preview server bind 0.0.0.0:3000 (host: true, port: 3000, strictPort, open: false)
 * - No process.env, no dynamic shell, no dotenv/cross-env, no runtime .env rewriting
 * - Server/preview/HMR always listen on 3000
 * - Prevents server restart/HMR on changes to .env* and vite.config.*
 * - Watch ignores: ['**/.env*', '**/vite.config.*']
 * - Additional plugin disables HMR/restart on env/config changes at handleHotUpdate layer
 */
const ignoreConfigAndEnvPlugin = () => ({
  name: 'ignore-config-and-env-hotupdate',
  handleHotUpdate(ctx) {
    if (
      ctx.file.match(/\.env(\..*)?$/) ||
      ctx.file.match(/vite\.config\.[cmjt]s$/)
    ) {
      // Returning [] disables all HMR/restart for these files
      return [];
    }
  }
});

export default defineConfig({
  plugins: [react(), ignoreConfigAndEnvPlugin()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
    hmr: { clientPort: 3000 },
    watch: {
      ignored: [
        '**/.env',
        '**/.env.*',
        '**/vite.config.js',
        '**/vite.config.mjs',
        '**/vite.config.ts',
        '**/vite.config.cjs',
      ]
    }
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false
  },
  optimizeDeps: {
    disabled: true
  }
});
