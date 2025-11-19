import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/**
 * Vite config for React SPA.
 * - Dev server and preview always bind to 0.0.0.0:3000 with strictPort.
 * - HMR always connects to 3000.
 * - All .env* and vite.config.* reloads are ignored for server restarts, including both watcher and handleHotUpdate layer.
 * - No process.env, dotenv, or shell expansions used for server config.
 * - No plugins may inject runtime env or rewatch configs.
 * - Prevents server restart or HMR update for changes to .env* or vite.config.* files.
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
    // Prevent Vite dev server from restarting on changes to .env* or vite.config.*
    watch: {
      ignored: [
        '**/.env',
        '**/.env.*',
        '**/vite.config.js',
        '**/vite.config.mjs',
        '**/vite.config.ts',
        '**/vite.config.cjs'
      ]
    }
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false
  },
  // Ensures Vite dependency optimization does not rewrite configs
  optimizeDeps: {
    disabled: true
  }
});
