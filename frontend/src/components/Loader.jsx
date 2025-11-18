import React from 'react';

// PUBLIC_INTERFACE
export default function Loader({ ariaLabel = 'Loading' }) {
  /** Accessible loader spinner. */
  return (
    <div className="u-center u-p-6" role="status" aria-label={ariaLabel}>
      <div
        aria-hidden="true"
        style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '3px solid rgba(0,0,0,0.1)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin 1s linear infinite'
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
