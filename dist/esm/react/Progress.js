import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
import { L } from '../i18n/core.js';
import { num } from '../i18n/format.js';
/** «3 of 7» · «3 από 7» */
export function progressText(value, max) {
    return L(`${num(value, 0)} of ${num(max, 0)}`, `${num(value, 0)} από ${num(max, 0)}`);
}
/** A determinate bar (value / max) or an indeterminate one. Respects prefers-reduced-motion through the tokens. */
export function Progress({ value, max = 100, label, showText, text, size = 'md', className, ...rest }) {
    const determinate = typeof value === 'number' && Number.isFinite(value);
    const pct = determinate ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
    const shown = text !== null && text !== void 0 ? text : (determinate && showText !== false ? progressText(value, max) : null);
    return (_jsxs("div", { className: cx('cg-progress', determinate ? 'cg-progress--determinate' : 'cg-progress--indeterminate', size === 'sm' && 'cg-progress--sm', className), ...rest, children: [_jsx("div", { className: "cg-progress__track", role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": determinate ? max : undefined, "aria-valuenow": determinate ? value : undefined, "aria-valuetext": determinate ? progressText(value, max) : undefined, "aria-busy": !determinate || undefined, children: _jsx("div", { className: "cg-progress__bar", style: determinate ? { width: `${pct}%` } : undefined }) }), shown != null && _jsx("div", { className: "cg-progress__text cg-mono", children: shown })] }));
}
