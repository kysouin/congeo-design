import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
export const Button = React.forwardRef(function Button({ variant = 'secondary', size = 'md', block, className, type = 'button', ...rest }, ref) {
    return (_jsx("button", { ref: ref, type: type, className: cx('cg-btn', `cg-btn--${variant}`, `cg-btn--${size}`, block && 'cg-btn--block', className), ...rest }));
});
/** Round icon button, 44 px (or 36 px dense). Pass a Lucide icon as the child. */
export const IconButton = React.forwardRef(function IconButton({ variant = 'secondary', label, size = 'md', tooltip = true, className, type = 'button', children, ...rest }, ref) {
    return (_jsx("button", { ref: ref, type: type, "aria-label": label, "data-tooltip": tooltip ? label : undefined, className: cx('cg-btn', `cg-btn--${variant}`, 'cg-btn--icon', size === 'sm' && 'cg-btn--icon-sm', className), ...rest, children: children }));
});
