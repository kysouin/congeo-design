"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressText = progressText;
exports.Progress = Progress;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_js_1 = require("./cx.js");
const core_js_1 = require("../i18n/core.js");
const format_js_1 = require("../i18n/format.js");
/** «3 of 7» · «3 από 7» */
function progressText(value, max) {
    return (0, core_js_1.L)(`${(0, format_js_1.num)(value, 0)} of ${(0, format_js_1.num)(max, 0)}`, `${(0, format_js_1.num)(value, 0)} από ${(0, format_js_1.num)(max, 0)}`);
}
/** A determinate bar (value / max) or an indeterminate one. Respects prefers-reduced-motion through the tokens. */
function Progress({ value, max = 100, label, showText, text, size = 'md', className, ...rest }) {
    const determinate = typeof value === 'number' && Number.isFinite(value);
    const pct = determinate ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
    const shown = text !== null && text !== void 0 ? text : (determinate && showText !== false ? progressText(value, max) : null);
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, cx_js_1.cx)('cg-progress', determinate ? 'cg-progress--determinate' : 'cg-progress--indeterminate', size === 'sm' && 'cg-progress--sm', className), ...rest, children: [(0, jsx_runtime_1.jsx)("div", { className: "cg-progress__track", role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": determinate ? max : undefined, "aria-valuenow": determinate ? value : undefined, "aria-valuetext": determinate ? progressText(value, max) : undefined, "aria-busy": !determinate || undefined, children: (0, jsx_runtime_1.jsx)("div", { className: "cg-progress__bar", style: determinate ? { width: `${pct}%` } : undefined }) }), shown != null && (0, jsx_runtime_1.jsx)("div", { className: "cg-progress__text cg-mono", children: shown })] }));
}
