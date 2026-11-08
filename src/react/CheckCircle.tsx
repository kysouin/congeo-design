import * as React from 'react';
import { cx } from './cx';

export interface CheckCircleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  /** Amber ring when the item is overdue and not done. */
  overdue?: boolean;
  onChange?: (checked: boolean) => void;
  /** Accessible name. */
  label?: string;
}

/** 22 px check circle with a 44 px hit area. */
export const CheckCircle = React.forwardRef<HTMLButtonElement, CheckCircleProps>(function CheckCircle(
  { checked, overdue, onChange, label = 'Έγινε', className, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={cx('cg-check', checked && 'cg-check--checked', overdue && !checked && 'cg-check--overdue', className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onChange?.(!checked);
      }}
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </button>
  );
});
