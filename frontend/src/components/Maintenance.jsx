import React from "react";

/**
 * PUBLIC_INTERFACE
 * Maintenance
 * A simple, accessible maintenance/coming-soon page that takes over the entire viewport.
 * Uses inline styles to avoid reliance on external CSS and ensure immediate availability.
 */
export default function Maintenance() {
  const primary = "#2563EB";   // Ocean Professional primary
  const secondary = "#F59E0B"; // Ocean Professional secondary
  const background = "#f9fafb";
  const surface = "#ffffff";
  const text = "#111827";

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: background,
    color: text,
    padding: "2rem",
  };

  const cardStyle = {
    background: surface,
    borderRadius: "16px",
    boxShadow:
      "0 2px 6px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.06)",
    maxWidth: "720px",
    width: "100%",
    padding: "2rem",
  };

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    background:
      "linear-gradient(90deg, rgba(37,99,235,0.08), rgba(17,24,39,0.02))",
    color: primary,
    border: `1px solid ${primary}22`,
    padding: "0.35rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.875rem",
    fontWeight: 600,
  };

  const titleStyle = {
    marginTop: "1rem",
    fontSize: "2rem",
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  };

  const subtitleStyle = {
    marginTop: "0.75rem",
    fontSize: "1.05rem",
    lineHeight: 1.6,
    color: "#374151",
  };

  const highlightStyle = {
    color: secondary,
    fontWeight: 700,
  };

  const footerStyle = {
    marginTop: "1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.975rem",
    color: "#4B5563",
  };

  const contactLinkStyle = {
    color: primary,
    textDecoration: "underline",
  };

  const footerNoteStyle = {
    marginTop: "1.5rem",
    fontSize: "0.85rem",
    color: "#6B7280",
  };

  return (
    <main
      role="main"
      aria-label="Site temporarily unavailable"
      style={containerStyle}
    >
      <section
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={cardStyle}
      >
        <span style={badgeStyle}>
          <span
            aria-hidden="true"
            style={{
              width: "8px",
              height: "8px",
              background: primary,
              borderRadius: "999px",
              boxShadow: `0 0 0 4px ${primary}22`,
            }}
          />
          Maintenance Mode
        </span>

        <h1 style={titleStyle}>
          We&rsquo;re crafting something beautiful.
        </h1>

        <p style={subtitleStyle}>
          Our site is currently undergoing improvements to bring you a{" "}
          <span style={highlightStyle}>modern</span>,{" "}
          <span style={highlightStyle}>accessible</span>, and{" "}
          <span style={highlightStyle}>responsive</span> experience inspired by
          the grace and rhythm of classical dance.
        </p>

        <div style={footerStyle}>
          <div>
            For inquiries or bookings, reach us at{" "}
            <a
              href="mailto:contact@example.com"
              style={contactLinkStyle}
              aria-label="Contact email"
            >
              contact@example.com
            </a>
          </div>
          <div>
            Thank you for your patience — we&rsquo;ll be live very soon.
          </div>
        </div>

        <p style={footerNoteStyle}>
          Tip: Site owners can disable maintenance mode by setting
          REACT_APP_MAINTENANCE_MODE=false and rebuilding.
        </p>
      </section>
    </main>
  );
}
