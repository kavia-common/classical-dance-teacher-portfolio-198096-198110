# Frontend Startup Guide

This React app uses Vite.

- Install dependencies:
  - npm ci (preferred in CI) or npm install

- Start dev server:
  - npm start
  - Defaults to port 3000. Configure via REACT_APP_PORT or VITE_PORT.

- Build & preview (useful in containers):
  - node ./scripts/start-preview.js
  - This builds and runs `vite preview` on an available port and binds to 0.0.0.0.

Environment variables (read at build time/runtime where applicable):
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED
- REACT_APP_ADMIN_API_TOKEN

Troubleshooting:
- Error: "ERR_MODULE_NOT_FOUND: Cannot find package 'vite' imported from .../vite/dist/node/cli.js"
  - Cause: dev dependencies not installed.
  - Fix: run `npm ci` (or `npm install`) in the `frontend` directory.
  - Ensure `vite` and `@vitejs/plugin-react` are present in devDependencies.
  - Start again with `npm start`.

Notes:
- The project contains a helper at scripts/start-preview.js that uses `npx vite` to avoid relying on internal bin paths.
- Vite server and preview bind to `0.0.0.0` so the app is reachable from outside the container.
