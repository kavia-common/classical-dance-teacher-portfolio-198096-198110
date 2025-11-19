import React, { useEffect, useState } from "react";
import { fetchGallery } from "../api/client";

// PUBLIC_INTERFACE
export default function Gallery() {
  /** Gallery page that loads items from backend API and shows basic grid. */
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchGallery(controller.signal)
      .then((data) => {
        setItems(Array.isArray(data?.items) ? data.items : []);
        setStatus("success");
      })
      .catch((e) => {
        setError(e?.message || "Failed to load gallery");
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  return (
    <section style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>Gallery</h2>
      {status === "loading" && <p>Loading gallery…</p>}
      {status === "error" && (
        <div role="alert" style={{ color: "#EF4444" }}>
          {error}
        </div>
      )}
      {status === "success" && items.length === 0 && <p>No items available yet.</p>}
      {items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {items.map((it) => (
            <figure
              key={it.id}
              style={{
                margin: 0,
                border: "1px solid var(--border-color)",
                borderRadius: 12,
                overflow: "hidden",
                background: "var(--bg-secondary)",
              }}
            >
              <img
                src={it.thumbnailUrl || it.imageUrl}
                alt={it.title || "Gallery item"}
                style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
              />
              <figcaption style={{ padding: "0.75rem", textAlign: "left" }}>
                <div style={{ fontWeight: 600 }}>{it.title}</div>
                {it.description && (
                  <div style={{ fontSize: 14, opacity: 0.8 }}>{it.description}</div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
