import * as React from 'react';
import { cx } from './cx.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full width. */
  block?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', block, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('cg-btn', `cg-btn--${variant}`, `cg-btn--${size}`, block && 'cg-btn--block', className)}
      {...rest}
    />
  );
});

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Required: the accessible name, since the button shows only an icon. Also the tooltip. */
  label: string;
  /** 44 px (touch, default) or 36 px (dense toolbars, desktop). */
  size?: 'md' | 'sm';
  /** Show the label as a tooltip on hover and focus. Default true. */
  tooltip?: boolean;
}

/** Round icon button, 44 px (or 36 px dense). Pass a Lucide icon as the child. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'secondary', label, size = 'md', tooltip = true, className, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      data-tooltip={tooltip ? label : undefined}
      className={cx('cg-btn', `cg-btn--${variant}`, 'cg-btn--icon', size === 'sm' && 'cg-btn--icon-sm', className)}
      {...rest}
    >
      {children}
    </button>
  );
});
