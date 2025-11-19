import { defineConfig } from 'vite';

/**
 * Minimal Vite 5 configuration without @vitejs/plugin-react.
 * - Uses esbuild's automatic JSX runtime for React 17+ so the plugin isn't required.
 * - Preserves server and preview host/port/allowedHosts settings from previous config.
 */
export default defineConfig({
  // Enable JSX handling via esbuild without the React plugin
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },

  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
  },

  preview: {
    host: true,
    port: 3000,
    // preserve allowedHosts list used previously
    allowedHosts: ['vscode-internal-33160-beta.beta01.cloud.kavia.ai'],
  },
});
