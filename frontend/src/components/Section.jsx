import React from 'react';

// PUBLIC_INTERFACE
export function Section({ title, description, children, ariaLabel }) {
  /** A consistent section wrapper with title and optional description. */
  return (
    <section aria-label={ariaLabel || title} className="section">
      {title && (
        <header className="section-header">
          <h2 className="section-title">{title}</h2>
          {description && <p className="section-desc">{description}</p>}
        </header>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
}
