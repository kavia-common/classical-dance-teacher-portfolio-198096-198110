#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Script to build and start Vite preview on an available port.
 * - Tries port 3000 by default; if unavailable, falls back to 3001.
 * - Binds to host 0.0.0.0 for containerized/cloud environments.
 * This helps avoid failures when port 3000 is already in use during CI or multi-run scenarios.
 */
const { spawn } = require('node:child_process');
const net = require('node:net');

function checkPort(port, host = '0.0.0.0') {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => {
        resolve(false);
      })
      .once('listening', () => {
        server.close(() => resolve(true));
      })
      .listen(port, host);
  });
}

async function pickPort() {
  const primary = 3000;
  const fallback = 3001;
  const primaryFree = await checkPort(primary);
  if (primaryFree) return primary;
  const fallbackFree = await checkPort(fallback);
  return fallbackFree ? fallback : primary; // worst case, attempt primary (will error similarly as default behavior)
}

async function run() {
  const host = '0.0.0.0';
  const port = await pickPort();

  // First build
  const build = spawn('npx', ['vite', 'build'], {
    stdio: 'inherit',
    shell: false,
  });

  build.on('exit', (code) => {
    if (code !== 0) {
      process.exit(code ?? 1);
    }
    // Then preview
    const preview = spawn('npx', ['vite', 'preview', '--host', host, '--port', String(port)], {
      stdio: 'inherit',
      shell: false,
    });

    preview.on('spawn', () => {
      console.log(`Vite preview starting on http://${host}:${port}`);
    });

    preview.on('exit', (pcode) => {
      process.exit(pcode ?? 0);
    });
  });
}

run().catch((err) => {
  console.error('Failed to start preview:', err);
  process.exit(1);
});
