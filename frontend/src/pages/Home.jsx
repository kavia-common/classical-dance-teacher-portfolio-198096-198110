import React from "react";

/**
 * PUBLIC_INTERFACE
 * Home
 * Default homepage fallback for the Classical Dance Teacher portfolio.
 */
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        color: "#111827",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: 0 }}>Classical Dance Teacher</h1>
        <p style={{ color: "#4b5563" }}>
          Welcome—this is a starter page. Replace with your actual sections and routing.
        </p>
      </header>
      <section
        style={{
          background: "white",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.05), 0 1px 1px -1px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>It works!</h2>
        <p>
          The app is running on the configured port. You can now build out the
          About, Achievements, Gallery, Classes & Schedule, and Contact sections.
        </p>
      </section>
    </main>
  );
}
