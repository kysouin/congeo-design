import * as React from 'react';
import { cx } from './cx';

export type ToastKind = 'info' | 'ok' | 'warn' | 'err';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  kind?: ToastKind;
  action?: { label: string; onClick: () => void };
}

/** One toast. Place inside <ToastRegion>. */
export function Toast({ kind = 'info', action, className, children, ...rest }: ToastProps) {
  return (
    <div role="status" className={cx('cg-toast', kind !== 'info' && `cg-toast--${kind}`, className)} {...rest}>
      <span className="cg-toast__icon" aria-hidden="true" />
      <span className="cg-toast__text">{children}</span>
      {action && (
        <button type="button" className="cg-toast__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export interface ToastRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render in flow instead of fixed to the top (for documentation). */
  inline?: boolean;
}

/** Fixed at the top, under the safe area. It never covers inputs: the keyboard and the inputs live at the bottom. */
export function ToastRegion({ inline, className, ...rest }: ToastRegionProps) {
  return <div aria-live="polite" className={cx('cg-toast-region', inline && 'cg-toast-region--inline', className)} {...rest} />;
}
