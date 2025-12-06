# Classical Dance Teacher — Frontend (Vite + React)

Development server:
- npm start (alias of vite)
- Dev server binds on 0.0.0.0 with strictPort and uses REACT_APP_PORT if set, else 3000.

Environment:
- Copy .env.example to .env and set variables as needed.
- REACT_APP_PORT: dev/preview port (defaults to 3000)
- REACT_APP_MAINTENANCE_MODE: true/false (default false)
- Other REACT_APP_* variables available for backend URLs and flags.

Scripts:
- start: vite
- dev: vite
- build: vite build
- preview: vite preview --strictPort --port 3000

Notes:
- No CRA (create-react-app) required. This app uses Vite.
- Entry points: index.html -> src/main.jsx -> src/App.jsx
- Maintenance mode renders a static page when enabled and does not block startup.

Run:
1) npm install
2) cp .env.example .env  (optional; customize)
3) npm start
4) Open http://localhost:3000 (or configured REACT_APP_PORT)

Preview built app:
- npm run build
- npm run preview
