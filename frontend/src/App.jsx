import React from "react";
import Maintenance from "./components/Maintenance";

/**
 * PUBLIC_INTERFACE
 * App
 * The root application component that conditionally renders global Maintenance mode based on env flag.
 * When maintenance is enabled, it prevents rendering any other application content.
 */
export default function App() {
  // Normalize env value with safe defaults.
  // Prefer explicit false for dev to avoid lock-in if the variable is missing.
  const raw =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      (import.meta.env.VITE_MAINTENANCE_MODE ??
        import.meta.env.REACT_APP_MAINTENANCE_MODE)) ??
    process.env?.REACT_APP_MAINTENANCE_MODE ??
    process.env?.VITE_MAINTENANCE_MODE ??
    "false";

  const normalized = String(raw).toLowerCase().trim();
  const isMaintenance =
    normalized === "1" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "on";

  if (isMaintenance) {
    return <Maintenance />;
  }

  // In non-maintenance mode, render a minimal Home if no routes/pages exist yet.
  // This avoids startup failure due to missing modules after recent changes.
  let Content = null;
  try {
    Content = React.lazy(() =>
      import("./pages/Home")
        .then((m) => m)
        .catch(() =>
          import("./pages/index")
            .then((m) => m)
            .catch(() =>
              import("./components/Home")
                .then((m) => m)
                .catch(() =>
                  import("./Main")
                    .then((m) => m)
                    .catch(() => ({
                      default: () => (
                        <div style={{ padding: "2rem", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
                          <h1 style={{ margin: 0 }}>Classical Dance Teacher</h1>
                          <p style={{ color: "#4b5563" }}>
                            App shell is running. Add or wire your routes/pages (pages/Home.jsx, pages/index.jsx, components/Home.jsx, or Main.jsx).
                          </p>
                        </div>
                      ),
                    }))
                )
            )
        )
    );
  } catch {
    Content = () => (
      <div style={{ padding: "2rem" }}>
        Classical Dance Teacher — App shell is running.
      </div>
    );
  }

  return (
    <React.Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <Content />
    </React.Suspense>
  );
}
