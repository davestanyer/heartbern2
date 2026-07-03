import React, { useEffect, useRef } from 'react';

interface ModalOverlayProps {
  labelledBy: string;
  onDismiss?: () => void;
  children: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal shell: traps focus inside the dialog, restores focus on
 * close, and dismisses on Escape when a dismiss handler is provided.
 */
export default function ModalOverlay({ labelledBy, onDismiss, children }: ModalOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusable[0] ?? dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onDismiss) {
        event.preventDefault();
        onDismiss();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="outline-none w-full flex justify-center"
      >
        {children}
      </div>
    </div>
  );
}
