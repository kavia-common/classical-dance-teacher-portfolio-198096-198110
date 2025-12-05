import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ErrorBoundary catches render errors and displays a fallback instead of a white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // PUBLIC_INTERFACE
  /** React lifecycle: capture errors in child tree. */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // PUBLIC_INTERFACE
  /** Log error; can be extended to report to a service. */
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;
    if (!hasError) return children;

    return (
      <div style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h1 style={{ color: 'var(--primary)' }}>Something went wrong</h1>
        <p style={{ color: 'var(--muted)' }}>
          An unexpected error occurred while rendering the page. Please try reloading.
        </p>
        {process.env.NODE_ENV !== 'production' && (
          <pre style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'auto'
          }}>
            {String(error)}
          </pre>
        )}
      </div>
    );
  }
}
