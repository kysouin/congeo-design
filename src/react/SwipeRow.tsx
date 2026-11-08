import * as React from 'react';
import { cx } from './cx';

export interface SwipeRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Swipe right reveals this (ok, «Έγινε»). */
  onSwipeRight?: () => void;
  /** Swipe left reveals this (ink-2, «Αύριο»). */
  onSwipeLeft?: () => void;
  rightLabel?: React.ReactNode;
  leftLabel?: React.ReactNode;
  /** Distance in px that commits the action. Default 72. */
  threshold?: number;
  /** Haptics are not available on the web. Called when the threshold is crossed and when an action commits. */
  onHaptic?: (kind: 'arm' | 'disarm' | 'commit') => void;
  /** Show a revealed state without interaction (for documentation). */
  preview?: 'left' | 'right';
  disabled?: boolean;
}

const SLOP = 8; // px before we decide the gesture is horizontal

/**
 * Horizontal swipe row. Uses pointer events, does not block vertical scroll
 * (touch-action: pan-y; a vertical move cancels the gesture), has a threshold
 * and springs back.
 */
export function SwipeRow({
  onSwipeRight,
  onSwipeLeft,
  rightLabel = 'Έγινε',
  leftLabel = 'Αύριο',
  threshold = 72,
  onHaptic,
  preview,
  disabled,
  className,
  children,
  ...rest
}: SwipeRowProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [x, setX] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [armed, setArmed] = React.useState(false);
  const gesture = React.useRef<{ id: number; x0: number; y0: number; mode: 'pending' | 'h' | 'cancelled' } | null>(null);
  const armedRef = React.useRef(false);

  const setArm = (v: boolean) => {
    if (armedRef.current === v) return;
    armedRef.current = v;
    setArmed(v);
    onHaptic?.(v ? 'arm' : 'disarm');
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || preview) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    gesture.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, mode: 'pending' };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId || g.mode === 'cancelled') return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    if (g.mode === 'pending') {
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        g.mode = 'cancelled'; // vertical: leave it to the scroller
        return;
      }
      g.mode = 'h';
      rootRef.current?.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    const allowRight = !!onSwipeRight;
    const allowLeft = !!onSwipeLeft;
    let next = dx;
    if (next > 0 && !allowRight) next = 0;
    if (next < 0 && !allowLeft) next = 0;
    // resist beyond the threshold
    const limit = threshold * 1.6;
    if (Math.abs(next) > threshold) {
      const over = Math.abs(next) - threshold;
      next = Math.sign(next) * (threshold + over * 0.35);
    }
    next = Math.max(-limit, Math.min(limit, next));
    setX(next);
    setArm(Math.abs(dx) >= threshold);
  };

  const finish = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    if (g.mode !== 'h') return;
    const dx = e.clientX - g.x0;
    setDragging(false);
    if (rootRef.current?.hasPointerCapture(e.pointerId)) rootRef.current.releasePointerCapture(e.pointerId);
    if (dx >= threshold && onSwipeRight) {
      onHaptic?.('commit');
      onSwipeRight();
    } else if (dx <= -threshold && onSwipeLeft) {
      onHaptic?.('commit');
      onSwipeLeft();
    }
    setX(0); // spring back (CSS transition with the token easing)
    setArm(false);
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    setDragging(false);
    setX(0);
    setArm(false);
  };

  const previewX = preview === 'right' ? threshold : preview === 'left' ? -threshold : 0;
  const offset = preview ? previewX : x;

  return (
    <div
      ref={rootRef}
      className={cx('cg-swipe', dragging && 'cg-swipe--dragging', (armed || preview) && 'cg-swipe--armed', className)}
      style={{ ['--cg-swipe-x' as any]: `${offset}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={onPointerCancel}
      {...rest}
    >
      <div className="cg-swipe__actions" aria-hidden="true">
        <div className="cg-swipe__action cg-swipe__action--left" style={{ opacity: offset > 0 ? 1 : 0 }}>
          {rightLabel}
        </div>
        <div className="cg-swipe__action cg-swipe__action--right" style={{ opacity: offset < 0 ? 1 : 0 }}>
          {leftLabel}
        </div>
      </div>
      <div className="cg-swipe__content">{children}</div>
    </div>
  );
}
