import React from 'react';

// PUBLIC_INTERFACE
export default function Alert({ type = 'info', title, message }) {
  /** Simple alert component for success/error/info messages. */
  const colors = {
    info: ['#2563EB', 'rgba(37,99,235,0.1)'],
    success: ['#047857', 'rgba(16,185,129,0.1)'],
    error: ['#B91C1C', 'rgba(239,68,68,0.12)'],
    warning: ['#92400E', 'rgba(245,158,11,0.12)'],
  }[type] || ['#2563EB', 'rgba(37,99,235,0.1)'];

  return (
    <div className="card" role="alert" style={{ borderColor: colors[0], background: colors[1], padding: '1rem' }}>
      {title && <strong style={{ display: 'block', marginBottom: '.25rem', color: colors[0] }}>{title}</strong>}
      {message && <div>{message}</div>}
    </div>
  );
}
