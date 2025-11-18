Environment variables (set via .env):

- REACT_APP_API_BASE: Base URL for API requests (preferred; overrides REACT_APP_BACKEND_URL if set)
- REACT_APP_BACKEND_URL: Fallback base URL for API requests
- REACT_APP_FRONTEND_URL: Canonical frontend origin (used for SEO); defaults to window.location.origin
- REACT_APP_WS_URL: WebSocket endpoint (reserved for future use)
- REACT_APP_HEALTHCHECK_PATH: Health path (default /healthz)
- REACT_APP_FEATURE_FLAGS: JSON or comma list of flags, e.g. {"newGallery":true} or newGallery:true
- REACT_APP_EXPERIMENTS_ENABLED: "true" to enable experiments
- REACT_APP_LOG_LEVEL: info|debug|silent (default info)
- REACT_APP_NODE_ENV: deployment environment (default process.env.NODE_ENV)
