# Maintenance Mode

The frontend supports a global maintenance mode that replaces all routes with a branded, accessible Maintenance page.

- Enable (default): `REACT_APP_MAINTENANCE_MODE=true` or `VITE_MAINTENANCE_MODE=true`
- Disable: set to `false` and rebuild.

Use `.env` in the `frontend` folder or your deployment environment variables.

This project supports both `REACT_APP_...` and `VITE_...` prefixes. If both are provided, `VITE_MAINTENANCE_MODE` takes precedence.

## Development

- `npm run dev` to start locally.
- `npm run build` to build.
- `npm run preview` to preview the production build.

```env
REACT_APP_MAINTENANCE_MODE=true
# or
VITE_MAINTENANCE_MODE=true
```
