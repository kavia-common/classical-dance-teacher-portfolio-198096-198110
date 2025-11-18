import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals';

// PUBLIC_INTERFACE
export function initWebVitals(report = console.log) {
  /** Initialize web-vitals reporting, no-op in test. */
  if (process.env.NODE_ENV === 'test') return;
  try {
    onCLS(report);
    onFID(report);
    onLCP(report);
    onINP(report);
    onTTFB(report);
  } catch {
    // ignore
  }
}
