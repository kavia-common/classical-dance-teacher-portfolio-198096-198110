#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Script to build and start Vite preview on an available port.
 * - Tries port 3000 by default; if unavailable, falls back to 3001 then 3002.
 * - Binds to host 0.0.0.0 for containerized/cloud environments.
 * - Uses `npx vite` so it never depends on internal vite/bin paths.
 * Environment:
 *   - REACT_APP_PORT (optional): If set, attempt to use this port first.
 *   - REACT_APP_FRONTEND_URL (optional): For reference in env, not used here.
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
  const envPort = process.env.REACT_APP_PORT ? Number(process.env.REACT_APP_PORT) : undefined;
  const candidates = [
    ...(envPort ? [envPort] : []),
    3000,
    3001,
    3002,
  ];

  for (const p of candidates) {
    // Skip invalid values
    if (!Number.isFinite(p) || p <= 0) continue;
    // Check availability
    const free = await checkPort(p);
    if (free) {
      console.log(`Selected port ${p}${p === 3000 ? ' (preferred)' : ''}`);
      return p;
    } else {
      console.log(`Port ${p} is busy, trying another one...`);
    }
  }

  // If all candidates appear busy, try 3000 anyway – Vite will emit a clear error.
  console.log('All candidate ports appear busy, attempting 3000');
  return 3000;
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
