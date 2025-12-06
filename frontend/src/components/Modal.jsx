import React, { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
/**
 * Accessible Modal dialog with focus trapping, ESC and overlay close.
 * - role="dialog" aria-modal="true"
 * - Focus is moved inside on open and restored to trigger on close
 * - Closes on overlay click and Escape key
 * - Uses site theme tokens via CSS variables
 * - Responsive: dialog is constrained to viewport with internal scrolling
 */
export default function Modal({
  isOpen,
  onClose,
  title = 'Dialog',
  children,
  initialFocusSelector,
  labelledById,
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  // Capture previously focused element when opening
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Move focus inside and trap it; handle Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Move focus to first focusable or to dialog
    const focusable = getFocusable(dialog);
    const initial =
      (initialFocusSelector && dialog.querySelector(initialFocusSelector)) || focusable[0] || dialog;
    if (initial && typeof initial.focus === 'function') initial.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      } else if (e.key === 'Tab') {
        // trap focus
        const items = getFocusable(dialog);
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
  }, [isOpen, onClose, initialFocusSelector]);

  // Restore focus to trigger on close
  useEffect(() => {
    if (isOpen) return;
    if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      style={overlayStyle}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById || undefined}
        ref={dialogRef}
        style={dialogStyle}
      >
        <div style={headerStyle}>
          <div id={labelledById} style={{ fontWeight: 700, color: 'var(--text)' }}>
            {title}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={iconBtnStyle}
          >
            ×
          </button>
        </div>
        <div style={contentWrapperStyle}>
          <div style={contentInnerStyle}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/** Return a list of focusable elements within a container. */
function getFocusable(container) {
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
  return Array.from(container.querySelectorAll(selectors.join(','))).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
}

// Styles use theme tokens
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'color-mix(in oklab, var(--bg), black 55%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem', // breathing room on tiny screens
  zIndex: 1000,
  overflowY: 'auto', // allow page to scroll if dialog is tall
  boxSizing: 'border-box',
};

const dialogStyle = {
  width: 'min(100vw - 2rem, 720px)',
  maxHeight: 'min(90vh, 920px)',
  background: 'var(--surface)',
  borderRadius: 12,
  border: '1px solid var(--border)',
  boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem 1rem',
  borderBottom: '1px solid var(--border)',
  background: 'var(--bg)',
  flex: '0 0 auto',
  boxSizing: 'border-box',
};

const iconBtnStyle = {
  background: 'var(--button-bg)',
  color: 'var(--button-fg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '0.25rem 0.5rem',
  cursor: 'pointer',
};

const contentWrapperStyle = {
  flex: '1 1 auto',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
};

const contentInnerStyle = {
  padding: '0 1rem 1rem',
  boxSizing: 'border-box',
};
