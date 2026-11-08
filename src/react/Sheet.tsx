import * as React from 'react';
import { cx } from './cx';

export interface SheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  /** Render in flow instead of fixed to the bottom (for documentation). */
  inline?: boolean;
}

/** Bottom sheet with a grabber. Escape and the backdrop close it. */
export function Sheet({ open, onClose, title, inline, className, children, ...rest }: SheetProps) {
  React.useEffect(() => {
    if (!open || inline) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, inline, onClose]);

  if (!open) return null;
  const panel = (
    <div role="dialog" aria-modal={!inline} className={cx('cg-sheet', inline && 'cg-sheet--inline', className)} {...rest}>
      <div className="cg-sheet__grabber" aria-hidden="true" />
      {title != null && <h2 className="cg-sheet__title">{title}</h2>}
      {children}
    </div>
  );
  if (inline) return panel;
  return (
    <>
      <div className="cg-sheet-backdrop" onClick={onClose} aria-hidden="true" />
      {panel}
    </>
  );
}
