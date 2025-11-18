import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export function Breadcrumbs({ pathname }) {
  /** Breadcrumbs based on current pathname. */
  if (!pathname) return null;
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = parts.map((part, idx) => {
    const path = '/' + parts.slice(0, idx + 1).join('/');
    return { name: part[0]?.toUpperCase() + part.slice(1), path };
  });

  return (
    <nav aria-label="Breadcrumb" className="u-mt-4 u-mb-4 text-muted" style={{ fontSize: '.9rem' }}>
      <ol style={{ listStyle: 'none', display: 'flex', gap: '.5rem', padding: 0, margin: 0 }}>
        <li><Link to="/">Home</Link></li>
        {crumbs.map((c, i) => (
          <Fragment key={c.path}>
            <li aria-hidden="true">/</li>
            <li aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
              {i === crumbs.length - 1 ? <span>{c.name}</span> : <Link to={c.path}>{c.name}</Link>}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
