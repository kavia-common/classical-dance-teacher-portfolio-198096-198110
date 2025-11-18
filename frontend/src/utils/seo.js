export const defaultMeta = {
  title: 'Classical Dance Teacher | Portfolio',
  description: 'Explore achievements, bio, gallery, classes, schedule, and contact information.',
  image: '/og-image.png',
};

// PUBLIC_INTERFACE
export function buildTitle(pageTitle) {
  /** Compose the document title consistently. */
  if (!pageTitle) return defaultMeta.title;
  return `${pageTitle} | Classical Dance Teacher`;
}

// PUBLIC_INTERFACE
export function canonicalUrl(base, path = '') {
  /** Build canonical URL safely from base and path. */
  const clean = (s) => (s || '').replace(/\/+$/, '');
  const add = (s) => (s || '').replace(/^\/+/, '');
  return `${clean(base)}/${add(path)}`;
}
