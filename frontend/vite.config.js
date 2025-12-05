import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
export default defineConfig({
  // Vite automatically loads .env and exposes variables prefixed with REACT_APP_
  // No changes needed for env handling per requirements.
  plugins: [react()],
  server: {
    // Bind to all interfaces to allow external access in dev
    host: true, // equivalent to '0.0.0.0'
    port: 3000,
  },
  preview: {
    // Bind to all interfaces to allow external access in preview
    host: true, // equivalent to '0.0.0.0'
    port: 3000,
    // Allowlisted hosts that are permitted to proxy/forward access to the preview server
    allowedHosts: ['vscode-internal-22306-beta.beta01.cloud.kavia.ai'],
  },
});
