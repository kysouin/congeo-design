import * as React from 'react';
import { cx } from './cx.js';
import { IconButton } from './Button.js';
import { L } from '../i18n/core.js';

export interface SheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  /** Show a close button in the head. */
  closeButton?: boolean;
  /** Render in flow instead of fixed to the bottom (for documentation). */
  inline?: boolean;
  /** Fraction of the sheet's height a drag must cover to close it. Default 0.25. */
  threshold?: number;
  /** Extra content in the head, right of the title. */
  headExtra?: React.ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const FLICK = 0.6; // px per ms

/**
 * Bottom sheet with a grabber. Closes on Escape, on the backdrop, and on a drag down (on the grabber or the
 * head) past 25 % of its height or a fast flick; otherwise it springs back. Focus is trapped inside while
 * open and returns to the opener on close. The spring honours prefers-reduced-motion through the tokens.
 */
export function Sheet({ open, onClose, title, closeButton, inline, threshold = 0.25, headExtra, className, children, style, ...rest }: SheetProps) {
  const panel = React.useRef<HTMLDivElement>(null);
  const opener = React.useRef<HTMLElement | null>(null);
  const [dy, setDy] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef<{ id: number; y0: number; t0: number; yPrev: number; tPrev: number; v: number } | null>(null);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  // focus: trap while open, return on close
  React.useEffect(() => {
    if (!open || inline) return;
    opener.current = (document.activeElement as HTMLElement | null) ?? null;
    const el = panel.current;
    const first = el?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? el)?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null || x === document.activeElement);
      if (!items.length) {
        e.preventDefault();
        el.focus();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === firstItem || document.activeElement === el)) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (el && !el.contains(e.target as Node)) (el.querySelector<HTMLElement>(FOCUSABLE) ?? el).focus();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocusIn);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocusIn);
      document.body.style.overflow = prevOverflow;
      const back = opener.current;
      if (back && typeof back.focus === 'function' && document.contains(back)) back.focus({ preventScroll: true });
    };
  }, [open, inline]);

  if (!open) return null;

  const start = (e: React.PointerEvent<HTMLDivElement>) => {
    if (inline) return;
    const t = e.target as HTMLElement;
    if (!t.closest('.cg-sheet__grabber, .cg-sheet__head') || t.closest('button, a, input, select, textarea')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { id: e.pointerId, y0: e.clientY, t0: e.timeStamp, yPrev: e.clientY, tPrev: e.timeStamp, v: 0 };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dt = e.timeStamp - d.tPrev;
    if (dt > 0) d.v = (e.clientY - d.yPrev) / dt;
    d.yPrev = e.clientY;
    d.tPrev = e.timeStamp;
    setDy(Math.max(0, e.clientY - d.y0));
  };
  const end = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const dist = e.clientY - d.y0;
    const h = panel.current?.getBoundingClientRect().height ?? 0;
    setDragging(false);
    setDy(0);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (e.type !== 'pointercancel' && (dist > h * threshold || (d.v > FLICK && dist > 24))) onCloseRef.current?.();
  };

  const content = (
    <div
      ref={panel}
      role="dialog"
      aria-modal={!inline}
      tabIndex={-1}
      className={cx('cg-sheet', inline && 'cg-sheet--inline', dragging && 'cg-sheet--dragging', className)}
      style={{ ...style, transform: dy ? `translateY(${dy}px)` : undefined }}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      {...rest}
    >
      <div className="cg-sheet__grabber" aria-hidden="true" />
      {(title != null || closeButton || headExtra) && (
        <div className="cg-sheet__head">
          {title != null && <h2 className="cg-sheet__title">{title}</h2>}
          {headExtra}
          {closeButton && (
            <IconButton variant="ghost" label={L('Close', 'Κλείσιμο')} onClick={() => onClose?.()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </IconButton>
          )}
        </div>
      )}
      {children}
    </div>
  );
  if (inline) return content;
  return (
    <>
      <div className="cg-sheet-backdrop" onClick={() => onClose?.()} aria-hidden="true" />
      {content}
    </>
  );
}
