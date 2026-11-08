"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = Toast;
exports.ToastRegion = ToastRegion;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_1 = require("./cx");
/** One toast. Place inside <ToastRegion>. */
function Toast({ kind = 'info', action, className, children, ...rest }) {
    return ((0, jsx_runtime_1.jsxs)("div", { role: "status", className: (0, cx_1.cx)('cg-toast', kind !== 'info' && `cg-toast--${kind}`, className), ...rest, children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-toast__icon", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { className: "cg-toast__text", children: children }), action && ((0, jsx_runtime_1.jsx)("button", { type: "button", className: "cg-toast__action", onClick: action.onClick, children: action.label }))] }));
}
/** Fixed at the top, under the safe area. It never covers inputs: the keyboard and the inputs live at the bottom. */
function ToastRegion({ inline, className, ...rest }) {
    return (0, jsx_runtime_1.jsx)("div", { "aria-live": "polite", className: (0, cx_1.cx)('cg-toast-region', inline && 'cg-toast-region--inline', className), ...rest });
}
