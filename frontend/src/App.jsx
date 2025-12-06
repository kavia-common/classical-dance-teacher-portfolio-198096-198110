import React from "react";
import Maintenance from "./components/Maintenance";

/**
 * PUBLIC_INTERFACE
 * App
 * The root application component that conditionally renders global Maintenance mode based on env flag.
 * When maintenance is enabled, it prevents rendering any other application content.
 */
export default function App() {
  // Default to true (enabled) when env is undefined.
  const maintenanceEnabled = String(
    import.meta?.env?.VITE_MAINTENANCE_MODE ??
      import.meta?.env?.REACT_APP_MAINTENANCE_MODE ??
      "true"
  )
    .toLowerCase()
    .trim();

  const isMaintenance =
    maintenanceEnabled === "1" ||
    maintenanceEnabled === "true" ||
    maintenanceEnabled === "yes" ||
    maintenanceEnabled === "on";

  if (isMaintenance) {
    return <Maintenance />;
  }

  // In non-maintenance mode, render the existing application.
  // To integrate with the existing app, we try importing the original root page.
  // If the project uses a different structure, replace the placeholder below by wiring your Router/Pages.
  let Content = null;
  try {
    // Attempt to lazy import the homepage or main router if it exists.
    // eslint-disable-next-line global-require
    // dynamic import to avoid bundling failure if file not present; wrapped in try/catch
    Content = React.lazy(() => import("./pages/Home").catch(() => import("./pages/index").catch(() => import("./components/Home").catch(() => import("./Main").catch(() => ({ default: () => <div style={{padding: '2rem'}}>App shell: integrate your routes here.</div> }))))));
  } catch {
    Content = () => <div style={{ padding: "2rem" }}>App shell: integrate your routes here.</div>;
  }

  return (
    <React.Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <Content />
    </React.Suspense>
  );
}
