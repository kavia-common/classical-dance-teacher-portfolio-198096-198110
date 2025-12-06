import React from "react";

/**
 * PUBLIC_INTERFACE
 * Fallback Home page shown only when maintenance mode is disabled
 * and no other home/router component is available.
 */
export default function Index() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome</h1>
      <p>
        Maintenance mode is disabled. Replace this page with your router or main
        app content.
      </p>
    </div>
  );
}
