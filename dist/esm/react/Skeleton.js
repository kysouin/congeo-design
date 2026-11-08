import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from './cx.js';
export function Skeleton({ variant = 'text', width, height, className, style, ...rest }) {
    return (_jsx("span", { "aria-hidden": "true", className: cx('cg-skeleton', `cg-skeleton--${variant}`, className), style: { width, height, ...style }, ...rest }));
}
