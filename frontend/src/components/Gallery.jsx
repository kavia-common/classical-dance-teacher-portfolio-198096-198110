import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from '../utils/api';

/**
 * PUBLIC_INTERFACE
 * Gallery section component with:
 * - Fetch images from backend public endpoint (/api/gallery)
 * - Clickable thumbnails opening an accessible lightbox (ESC to close, arrow keys for next/prev)
 * - Focus trapping within modal and return focus to trigger on close
 * - Continuous left-to-right auto-scrolling marquee strip that pauses on hover/focus and when modal open
 * - Applies saved focalPoint (x,y 0..1) via CSS object-position for marquee previews
 * - Respects prefers-reduced-motion and site tokens (light/dark)
 */
export default function Gallery({ images }) {
  // Load images from backend if not passed as prop
  const [fetched, setFetched] = useState(null);
  const [loadErr, setLoadErr] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (Array.isArray(images) && images.length) {
        setFetched(images);
        return;
      }
      try {
        const data = await apiFetch('/gallery', { headers: { Accept: 'application/json' } });
        if (mounted) setFetched(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) {
          setLoadErr(e.message || 'Failed to load gallery');
          setFetched([]);
        }
      }
    })();
    return () => { mounted = false; };
  }, [images]);

  // Fallback placeholders
  const placeholders = [
    {
      src: 'https://images.pexels.com/photos/26856873/pexels-photo-26856873.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Classical dance pose silhouette on stage',
      caption: 'Graceful pose on stage',
      focalPoint: { x: 0.5, y: 0.5 },
    },
    {
      src: 'https://images.pexels.com/photos/31880368/pexels-photo-31880368.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Traditional costume detail',
      caption: 'Traditional costume details',
      focalPoint: { x: 0.5, y: 0.5 },
    },
    {
      src: 'https://images.pexels.com/photos/16039776/pexels-photo-16039776.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Practice session in studio',
      caption: 'Practice session',
      focalPoint: { x: 0.5, y: 0.5 },
    },
    {
      src: 'https://images.pexels.com/photos/20134504/pexels-photo-20134504.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Performance with live musicians',
      caption: 'Performance night',
      focalPoint: { x: 0.5, y: 0.5 },
    },
    {
      src: 'https://images.pexels.com/photos/20134505/pexels-photo-20134505.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Anklet bells and footwork',
      caption: 'Rhythmic footwork',
      focalPoint: { x: 0.5, y: 0.5 },
    },
    {
      src: 'https://images.pexels.com/photos/33638407/pexels-photo-33638407.jpeg?q=80&w=1200&auto=format&fit=crop',
      alt: 'Elegant hand gestures closeup',
      caption: 'Elegant mudras',
      focalPoint: { x: 0.5, y: 0.5 },
    },
  ];

  const baseImages = useMemo(() => {
    if (Array.isArray(images) && images.length) return images;
    if (Array.isArray(fetched) && fetched.length) return fetched;
    return placeholders;
  }, [images, fetched]);

  // Duplicate the array for marquee seamless loop
  const marqueeImages = useMemo(() => [...baseImages, ...baseImages], [baseImages]);

  // Modal/lightbox state
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef(null);
  const modalRef = useRef(null);

  // Marquee animation control
  const stripRef = useRef(null);
  const [pauseMarquee, setPauseMarquee] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Handlers
  const openModal = useCallback((index, triggerEl) => {
    setActiveIndex(index);
    setIsOpen(true);
    triggerRef.current = triggerEl || null;
    setPauseMarquee(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setPauseMarquee(false);
    // restore focus to the trigger
    if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
      triggerRef.current.focus();
    }
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % baseImages.length);
  }, [baseImages.length]);

  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + baseImages.length) % baseImages.length);
  }, [baseImages.length]);

  // Focus trapping in modal and key handling
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Move focus into the modal
    const focusable = getFocusable(modal);
    if (focusable.length) {
      focusable[0].focus();
    } else {
      modal.focus();
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
      } else if (e.key === 'Tab') {
        // trap focus
        const items = getFocusable(modal);
        if (!items.length) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeModal, showNext, showPrev]);

  // Setup marquee animation via CSS variables; pause on hover/focus or when pauseMarquee true
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onMouseEnter = () => setPauseMarquee(true);
    const onMouseLeave = () => { if (!isOpen) setPauseMarquee(false); };
    const onFocusIn = () => setPauseMarquee(true);
    const onFocusOut = () => { if (!isOpen) setPauseMarquee(false); };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, [isOpen]);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      style={{
        margin: '2rem 0',
        padding: '2rem',
        background: 'var(--surface)',
        borderRadius: 12,
        boxShadow: 'var(--section-shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 id="gallery-heading" style={{ color: 'var(--primary)', margin: 0 }}>Gallery</h2>
          <p style={{ marginTop: 6, color: 'var(--muted-2)' }}>
            {loadErr ? `Error: ${loadErr}` : 'Glimpses from performances and practice.'}
          </p>
        </div>
        <span aria-hidden="true" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Visual stories</span>
      </div>

      {/* Marquee strip */}
      <div
        aria-label="Featured photos scrolling strip"
        ref={stripRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 12,
          border: '1px solid var(--border)',
          marginTop: '1rem',
          background: 'var(--bg)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '0.75rem',
            width: 'max-content',
            animation: prefersReducedMotion || pauseMarquee ? 'none' : 'marquee-slide 30s linear infinite',
          }}
        >
          {marqueeImages.map((img, idx) => {
            const originalIndex = idx % baseImages.length;
            const objPos = computeObjectPosition(img);
            return (
              <button
                key={`${img.src}-marquee-${idx}`}
                onClick={(e) => openModal(originalIndex, e.currentTarget)}
                aria-label={`Open image: ${img.alt || 'Photo'}`}
                style={{
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  padding: 0,
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  style={{
                    display: 'block',
                    width: 320,           // larger thumbnails for better visibility
                    height: 200,
                    objectFit: 'cover',
                    objectPosition: objPos,
                  }}
                  srcSet={`
                    ${img.src} 1x
                  `}
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 320px"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          ref={modalRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'color-mix(in oklab, var(--bg), black 55%)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 'min(96vw, 1200px)',
              maxHeight: '92vh',
              background: 'var(--surface)',
              borderRadius: 14,
              border: '1px solid var(--border)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', background: 'var(--bg)', display: 'grid', placeItems: 'center' }}>
              <img
                src={baseImages[activeIndex].src}
                alt={baseImages[activeIndex].alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(92vh - 80px)', // keep within viewport
                  objectFit: 'contain',
                  display: 'block',
                  background: 'var(--bg)',
                }}
              />
              {/* Controls */}
              <div
                style={{
                  position: 'absolute',
                  insetInline: 0,
                  top: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 0.5rem',
                  gap: '0.5rem',
                }}
              >
                <button
                  onClick={closeModal}
                  aria-label="Close viewer"
                  style={controlStyle()}
                >
                  ×
                </button>
              </div>
              <div
                style={{
                  position: 'absolute',
                  insetInline: 0,
                  bottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 0.5rem',
                  gap: '0.5rem',
                }}
              >
                <button
                  onClick={showPrev}
                  aria-label="Previous image"
                  style={controlStyle()}
                >
                  ◀
                </button>
                <span
                  aria-live="polite"
                  style={{
                    color: 'var(--text)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    padding: '0.25rem 0.6rem',
                    fontSize: 12,
                  }}
                >
                  {activeIndex + 1} / {baseImages.length}
                </span>
                <button
                  onClick={showNext}
                  aria-label="Next image"
                  style={controlStyle()}
                >
                  ▶
                </button>
              </div>
            </div>
            {!!baseImages[activeIndex].caption && (
              <div style={{ padding: '0.85rem 1rem', color: 'var(--muted)' }}>
                {baseImages[activeIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyframes for marquee */}
      <style>
        {`
          @keyframes marquee-slide {
            from { transform: translateX(-50%); }
            to { transform: translateX(0%); }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes marquee-slide {
              from { transform: none; }
              to { transform: none; }
            }
          }
        `}
      </style>
    </section>
  );
}

// Helpers

/**
 * PUBLIC_INTERFACE
 * Return a list of focusable elements within a container.
 */
function getFocusable(container) {
  /** Returns tabbable/focusable elements for focus trapping. */
  const selectors = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(container.querySelectorAll(selectors.join(',')))
    .filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

/**
 * PUBLIC_INTERFACE
 * React hook to detect prefers-reduced-motion
 */
function usePrefersReducedMotion() {
  /** Hook reads media query to disable animations for accessibility. */
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const onChange = () => setPrefers(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange);
    };
  }, []);
  return prefers;
}

/**
 * PUBLIC_INTERFACE
 * Shared control button style for modal
 */
function controlStyle() {
  /** Uses site tokens for light/dark and consistent sizing. */
  return {
    background: 'var(--button-bg)',
    color: 'var(--button-fg)',
    border: '1px solid var(--border)',
    borderRadius: 999,
    padding: '0.4rem 0.65rem',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  };
}

/**
 * PUBLIC_INTERFACE
 * Compute CSS object-position string from image focalPoint metadata.
 */
function computeObjectPosition(img) {
  const fp = img && img.focalPoint;
  const x = fp && isFinite(fp.x) ? Math.max(0, Math.min(1, fp.x)) : 0.5;
  const y = fp && isFinite(fp.y) ? Math.max(0, Math.min(1, fp.y)) : 0.5;
  return `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`;
}
