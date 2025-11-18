import { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export function useIntersection(options = { root: null, rootMargin: '0px', threshold: 0.2 }) {
  /** Observe element visibility in viewport. */
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}
