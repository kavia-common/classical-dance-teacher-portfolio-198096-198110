import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 page. */
  return (
    <div className="u-center u-p-6">
      <SEO title="Not Found" />
      <div className="card u-p-6" style={{ textAlign: 'center' }}>
        <h2>Page Not Found</h2>
        <p className="text-muted">We couldn't find what you were looking for.</p>
        <Link to="/" className="btn">Go Home</Link>
      </div>
    </div>
  );
}
