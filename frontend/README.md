# Frontend App Guide

## Overview

This is the React frontend for the Classical Dance Teacher portfolio. It is a single-page application (SPA) built with Create React App, React Router v6, and react-helmet-async. The app provides sections for Home, About, Gallery, Classes & Schedule with booking, and Contact, and is optimized for performance, SEO, and accessibility.

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Install dependencies
```bash
npm install
```

### Run in development
```bash
# Default CRA dev server at http://localhost:3000
npm start
```

### Run tests (with MSW mocks)
```bash
# Interactive
npm test

# CI mode (recommended for non-interactive environments)
CI=true npm test -- --watchAll=false
```

### Build for production
```bash
npm run build
```

The production build is output to the build/ directory.

## Environment Configuration

Environment variables are read using the prefix REACT_APP_ and consumed via:
- src/utils/env.js (validated with zod; used by components/hooks)
- src/services/apiClient.js (Axios baseURL and logging)

You can define these in a .env file (or process environment). Supported keys:

- REACT_APP_API_BASE: Base URL for API requests (preferred; overrides REACT_APP_BACKEND_URL if set). Used by src/services/apiClient.js.
- REACT_APP_BACKEND_URL: Fallback base URL for API requests if REACT_APP_API_BASE is not provided.
- REACT_APP_FRONTEND_URL: Canonical frontend origin used for SEO and canonical tags; defaults to window.location.origin. Consumed via useEnv() and passed into SEO component in App.
- REACT_APP_WS_URL: WebSocket endpoint (reserved for future use). Available via useEnv().
- REACT_APP_NODE_ENV: Deployment environment string; defaults to process.env.NODE_ENV. Exposed via useEnv().
- REACT_APP_NEXT_TELEMETRY_DISABLED: Not used by this app; can be ignored. Included for compatibility with some environments.
- REACT_APP_ENABLE_SOURCE_MAPS: Not used directly; CRA build respects GENERATE_SOURCEMAP instead. If present in your environment it will have no effect in this app.
- REACT_APP_PORT: Not used by CRA dev server; dev port is 3000 by default. To change, use PORT=3001 npm start.
- REACT_APP_TRUST_PROXY: Not used in frontend; relevant to Node server environments only.
- REACT_APP_LOG_LEVEL: info|debug|silent (default info). Controls API error console logging in apiClient.
- REACT_APP_HEALTHCHECK_PATH: Path used by healthService; default /healthz.
- REACT_APP_FEATURE_FLAGS: JSON or comma list of flags, e.g. {"newGallery":true} or newGallery:true. Parsed in useEnv() and exposed as FLAGS.
- REACT_APP_EXPERIMENTS_ENABLED: "true" to enable experiments; exposed as boolean via useEnv().

Example .env:
```bash
# API base preferred
REACT_APP_API_BASE=https://api.example.com
# or fallback
# REACT_APP_BACKEND_URL=https://backend.example.com

REACT_APP_FRONTEND_URL=https://dance.example.com
REACT_APP_WS_URL=
REACT_APP_HEALTHCHECK_PATH=/healthz
REACT_APP_FEATURE_FLAGS=newGallery:true,ab:false
REACT_APP_EXPERIMENTS_ENABLED=true
REACT_APP_LOG_LEVEL=info
REACT_APP_NODE_ENV=production

# Not used directly by this app (no effect)
REACT_APP_NEXT_TELEMETRY_DISABLED=1
REACT_APP_ENABLE_SOURCE_MAPS=true
REACT_APP_PORT=3000
REACT_APP_TRUST_PROXY=true
```

Environment resolution details:
- API base URL: REACT_APP_API_BASE > REACT_APP_BACKEND_URL > "/" (see src/services/apiClient.js and src/__tests__/services.env.test.js).
- Health check path: REACT_APP_HEALTHCHECK_PATH or "/healthz" (see src/services/healthService.js).
- SEO canonical URL: from REACT_APP_FRONTEND_URL via useEnv().

For more on environment variables, see ENVIRONMENT.md in this directory.

## Routes Overview

The main routes are defined in src/App.js using React Router v6. Pages are code-split via React.lazy:

- / → Home (src/pages/Home.jsx)
- /about → About (src/pages/About.jsx)
- /gallery → Gallery (src/pages/Gallery.jsx)
- /classes → Classes & Schedule (src/pages/Classes.jsx)
- /contact → Contact (src/pages/Contact.jsx)
- * → NotFound (src/pages/NotFound.jsx)

The layout includes:
- Navbar with navigation and theme toggle (src/components/Navbar.jsx)
- Breadcrumbs based on current pathname (src/components/Breadcrumbs.jsx)
- Footer with basic links (src/components/Footer.jsx)

SEO tags are provided per page via src/components/SEO.jsx.

## Mocking with MSW (Mock Service Worker)

This project uses MSW for deterministic API mocking in tests only.

- Handlers: src/mocks/handlers.js
  - GET /healthz and /health
  - GET /api/classes
  - GET /api/schedule
  - GET /api/bookings
  - GET /api/availability?date=YYYY-MM-DD&classType=beginner|intermediate|advanced
  - POST /api/booking
  - POST /api/contact
  - GET /api/gallery
- Server: src/mocks/server.js
- Test wiring: src/setupTests.js starts the MSW server before tests, resets after each, and closes after all.

Per-test overrides:
```js
import { server } from '../src/mocks/server';
import { http, HttpResponse } from 'msw';

server.use(
  http.get('/api/gallery', () => HttpResponse.json({ images: [{ id: 1, src: '/x.png', alt: 'Alt' }] }))
);
```

Note: MSW is not enabled in development runtime by default; it is set up only in Jest tests.

See MSW.md in this directory for details.

## Available npm Scripts

Defined in frontend/package.json:

- npm start: Starts CRA dev server at http://localhost:3000
- npm test: Runs Jest in watch mode with react-scripts and MSW setup
- npm run build: Builds the production bundle to build/
- npm run eject: Ejects CRA (irreversible)

Common variations:
- Change port for dev server:
  ```bash
  PORT=3001 npm start
  ```
- Run tests in CI:
  ```bash
  CI=true npm test -- --watchAll=false
  ```

## Testing

The test suite uses React Testing Library and MSW. Useful commands:

- Unit/integration tests:
  ```bash
  npm test
  ```
- Non-interactive tests for CI:
  ```bash
  CI=true npm test -- --watchAll=false
  ```

Test coverage highlights (see src/__tests__):
- app.routing.test.js: route rendering and content assertions
- app.accessibility.test.js: checks for skip link, landmarks, and nav roles
- services.env.test.js: verifies environment variable resolution for API base and health path
- booking.form.test.js and contact.form.test.js: form validation and submission flows
- endpoints.smoke.test.js: smoke tests for API endpoints via MSW
- gallery.service.test.js: service-level fetch of gallery data

## Performance, SEO, and Accessibility Notes

- Performance:
  - Route-based code splitting with React.lazy and Suspense (src/App.js)
  - Lazy-loaded images in Gallery (loading="lazy")
  - Minimal dependencies and custom CSS for faster load
  - Web Vitals collection available via src/utils/analytics.js (no-op in test). You can wire initWebVitals in index.js if you wish to report metrics.

- SEO:
  - Meta tags via SEO component (src/components/SEO.jsx)
  - Dynamic title composition via utils/seo.js buildTitle()
  - Use REACT_APP_FRONTEND_URL to provide canonical base for URLs
  - Open Graph and Twitter card tags are included in SEO component

- Accessibility:
  - Skip to content link (App.js)
  - Landmark roles: navigation, main, contentinfo
  - Forms with associated labels and clear focus styles
  - Color contrast and focus ring via CSS variables
  - Tests include accessibility checks for core landmarks

## Services and API

Axios client:
- src/services/apiClient.js provides getApiClient() which:
  - Sets baseURL from REACT_APP_API_BASE or REACT_APP_BACKEND_URL
  - Adds basic interceptors and error logging controlled by REACT_APP_LOG_LEVEL

Feature flags and environment:
- src/utils/env.js exports useEnv() hook that returns:
  - API_BASE, FRONTEND_URL, WS_URL, HEALTH_PATH, LOG_LEVEL, NODE_ENV, FLAGS (parsed), EXPERIMENTS (boolean)
- src/hooks/useFeatureFlags.js provides convenience wrapper to read flags and experimentsEnabled.

Health check:
- src/services/healthService.js reads HEALTH_PATH from useEnv() and defaults to /healthz. This service is covered by tests to validate env overrides.

## Troubleshooting

- I cannot reach my real backend in development:
  - Ensure REACT_APP_API_BASE is set to a reachable origin, e.g. http://localhost:4000
  - Verify there are no CORS issues on the backend

- My route shows “Page Not Found”:
  - Confirm you navigated to one of the defined routes
  - For direct deep-linking in production, ensure your server is configured to serve index.html for unknown paths (SPA fallback)

- Build source maps:
  - CRA respects GENERATE_SOURCEMAP=false to disable source maps. REACT_APP_ENABLE_SOURCE_MAPS is unused.

- Changing dev server port:
  - Use PORT environment variable when running npm start, e.g. PORT=3001 npm start

## Repository Structure (Frontend)

- src/App.js: Routes, layout, SEO
- src/pages/: Page components (Home, About, Gallery, Classes, Contact, NotFound)
- src/components/: Reusable UI components
- src/services/: API client and endpoint services
- src/utils/: env, seo, validators, analytics
- src/hooks/: useApi, useFeatureFlags, useIntersection
- src/mocks/: MSW handlers and server
- src/__tests__/: Jest tests
- styles/: theme and utilities CSS
- providers/ThemeContext.jsx: light/dark theme provider

## Additional Docs

- ENVIRONMENT.md: Details about environment variables used in the app
- MSW.md: How MSW is set up and used in tests

## License

Private template for KAVIA projects.
