import * as React from 'react';
import { cx } from './cx.js';
import { L } from '../i18n/core.js';
import { num } from '../i18n/format.js';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value. Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  /** Accessible name, e.g. «Creating PDF». Required. */
  label: string;
  /** Show the «3 of 7» text. Default true when determinate. */
  showText?: boolean;
  /** Replace the «3 of 7» text. */
  text?: React.ReactNode;
  size?: 'sm' | 'md';
}

/** «3 of 7» · «3 από 7» */
export function progressText(value: number, max: number): string {
  return L(`${num(value, 0)} of ${num(max, 0)}`, `${num(value, 0)} από ${num(max, 0)}`);
}

/** A determinate bar (value / max) or an indeterminate one. Respects prefers-reduced-motion through the tokens. */
export function Progress({ value, max = 100, label, showText, text, size = 'md', className, ...rest }: ProgressProps) {
  const determinate = typeof value === 'number' && Number.isFinite(value);
  const pct = determinate ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const shown = text ?? (determinate && showText !== false ? progressText(value, max) : null);
  return (
    <div className={cx('cg-progress', determinate ? 'cg-progress--determinate' : 'cg-progress--indeterminate', size === 'sm' && 'cg-progress--sm', className)} {...rest}>
      <div
        className="cg-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={determinate ? max : undefined}
        aria-valuenow={determinate ? value : undefined}
        aria-valuetext={determinate ? progressText(value, max) : undefined}
        aria-busy={!determinate || undefined}
      >
        <div className="cg-progress__bar" style={determinate ? { width: `${pct}%` } : undefined} />
      </div>
      {shown != null && <div className="cg-progress__text cg-mono">{shown}</div>}
    </div>
  );
}
