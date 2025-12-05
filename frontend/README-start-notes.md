# Frontend Start Notes

- This project uses Vite for development, build, and preview.
- Scripts:
  - npm run dev    -> Starts Vite dev server on port 3000 (HMR)
  - npm run build  -> Builds to ./dist
  - npm run preview -> Serves ./dist on port 3000
  - npm start      -> Builds then previews on port 3000

Common issues:
- If you see `ERR_MODULE_NOT_FOUND` referencing vite/dist/node/cli.js, reinstall dependencies:
  - npm ci --ignore-scripts
- Ensure Node.js >= 18 (Vite 5 requires ^18 or >=20).
- Environment variables (set via .env):
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

Notes:
- Vite preview listens on 0.0.0.0:3000 for containerized environments.
- Use `npm run dev` for local development and `npm start` for production-like preview.
