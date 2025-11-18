MSW (Mock Service Worker) is configured for tests only.

- Handlers are in src/mocks/handlers.js, covering:
  - GET /healthz and /health
  - GET /api/classes
  - GET /api/schedule
  - GET /api/bookings
  - GET /api/availability?date=YYYY-MM-DD&classType=beginner|intermediate|advanced
  - POST /api/booking
  - POST /api/contact
  - GET /api/gallery

- The Node server adapter is created in src/mocks/server.js and wired in src/setupTests.js.

- Usage:
  - Tests automatically start the server (beforeAll), reset handlers (afterEach), and close (afterAll).
  - For custom per-test handler overrides, import { server } and call server.use(...) with `http.*` from msw.

This setup enables deterministic tests without hitting real backends.
