import React from "react";

/**
 * PUBLIC_INTERFACE
 * Maintenance
 * Displays a simple maintenance mode page.
 */
export default function Maintenance() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f9fafb",
        color: "#111827",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          We’ll be back soon
        </h1>
        <p style={{ color: "#4b5563", marginBottom: "1rem" }}>
          Our site is currently undergoing maintenance. Thanks for your patience.
        </p>
        <div
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "#2563EB",
            color: "white",
            borderRadius: "0.5rem",
          }}
        >
          Status: Maintenance mode
        </div>
      </div>
    </div>
  );
}
