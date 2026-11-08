import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
import { accentAttrs } from './types.js';
export function Card({ size = 'md', raised, flat, tint, title, as = 'div', className, children, ...rest }) {
    const Tag = as;
    return (_jsxs(Tag, { className: cx('cg-card', size === 'lg' && 'cg-card--lg', raised && 'cg-card--raised', flat && 'cg-card--flat', tint && 'cg-card--tint', className), ...accentAttrs(tint), ...rest, children: [title != null && _jsx("h3", { className: "cg-card__title", children: title }), children] }));
}
