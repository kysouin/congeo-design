import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
export const Button = React.forwardRef(function Button({ variant = 'secondary', size = 'md', block, className, type = 'button', ...rest }, ref) {
    return (_jsx("button", { ref: ref, type: type, className: cx('cg-btn', `cg-btn--${variant}`, `cg-btn--${size}`, block && 'cg-btn--block', className), ...rest }));
});
/** Round 44 px icon button. Pass a Lucide icon as the child. */
export const IconButton = React.forwardRef(function IconButton({ variant = 'secondary', label, className, type = 'button', children, ...rest }, ref) {
    var _a;
    return (_jsx("button", { ref: ref, type: type, "aria-label": label, title: (_a = rest.title) !== null && _a !== void 0 ? _a : label, className: cx('cg-btn', `cg-btn--${variant}`, 'cg-btn--icon', className), ...rest, children: children }));
});
