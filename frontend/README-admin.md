# Admin Pages (Frontend)

This project includes a lightweight Admin section with no external routing or notification libraries.

Routes:
- /admin — landing with links
- /admin/bookings — list and update booking status/notes
- /admin/gallery — list, create, edit, and delete gallery items

Admin Token:
- Click “Admin” in footer, then the Settings button in the header to set the ADMIN_TOKEN.
- The token is stored in memory and localStorage under key `ADMIN_TOKEN`.
- All admin requests include header `X-Admin-Token: <token>`.

API Base:
- API base is chosen from the following (first present):
  - `VITE_API_BASE`
  - `REACT_APP_API_BASE`
  - `REACT_APP_BACKEND_URL`
  - Fallback: `/api`
- Ensure the backend serves under that base path (e.g., `/api/admin/bookings`).

Endpoints used:
- Bookings:
  - GET `/api/admin/bookings?status=` (optional)
  - PATCH `/api/admin/bookings/:id` with `{ status?, notes? }`
- Gallery:
  - GET `/api/gallery`
  - POST `/api/admin/gallery`
  - PUT `/api/admin/gallery/:id`
  - DELETE `/api/admin/gallery/:id`

Notifications:
- Minimal toast utility shows small messages in the bottom-right of the Admin pages.

Notes:
- No external dependencies were added. All HTTP is via `fetch`.
- The Admin UI uses the site’s color scheme (Ocean Professional) and is responsive.

```

Instructions:
1. Start dev server: `npm run dev`
2. Open `/admin`, set token in Settings, and begin managing bookings and gallery.

