# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight and modern UI
- Minimal dependencies for fast loading
- Simple and easy to modify

## Environment variables

Create a `.env` file based on `.env.example`:
- REACT_APP_API_BASE: The origin of the backend (e.g., http://localhost:5000). This is preferred.
- REACT_APP_BACKEND_URL: Optional fallback if REACT_APP_API_BASE is not provided.

The Gallery feature fetches from `${REACT_APP_API_BASE}/api/gallery/` (or the fallback base).

## Verifying the Gallery

1. Start the backend (Flask) at http://localhost:5000 (see backend README).
2. Copy `.env.example` to `.env` and set:
   ```
   REACT_APP_API_BASE=http://localhost:5000
   ```
3. Run:
   ```
   npm install
   npm start
   ```
4. Open http://localhost:3000 and click "Gallery" in the top-left nav.
5. You should see sample images. If you see a 404, check:
   - The backend is running and exposes GET /api/gallery/
   - The .env is set and the app reloaded (CRA reads env at build time)

## Scripts

- npm start: Start development server
- npm test: Run tests
- npm run build: Build production bundle
