import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
import { L } from '../i18n/core.js';
import { accentAttrs } from './types.js';
export function Row({ title, meta, accent, pending, done, lead, trail, as, href, className, children, ...rest }) {
    const Tag = as !== null && as !== void 0 ? as : (href ? 'a' : 'div');
    return (_jsxs(Tag, { className: cx('cg-row', accent && 'cg-row--accent', done && 'cg-row--done', className), href: href, ...accentAttrs(accent), ...rest, children: [accent && _jsx("span", { className: "cg-row__accent", "aria-hidden": "true" }), _jsx("span", { className: "cg-row__lead", children: lead }), _jsxs("span", { className: "cg-row__body", children: [_jsx("span", { className: "cg-row__title", children: title }), meta != null && _jsx("span", { className: "cg-row__meta", children: meta }), children] }), _jsxs("span", { className: "cg-row__trail", children: [pending && _jsx("span", { className: "cg-row__pending", role: "img", "aria-label": L('Pending', 'Εκκρεμεί') }), trail] })] }));
}
