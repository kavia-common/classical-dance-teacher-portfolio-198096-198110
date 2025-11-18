import React from 'react';

// PUBLIC_INTERFACE
export default function ClassCard({ title, level, description, onBook }) {
  /** Display a class item with booking CTA. */
  return (
    <article className="card u-p-6">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p className="text-muted" style={{ margin: 0 }}>{level}</p>
      <p>{description}</p>
      <button className="btn" onClick={onBook}>Book</button>
    </article>
  );
}
