"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = EmptyState;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_1 = require("./cx");
function EmptyState({ icon, title, text, action, className, ...rest }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, cx_1.cx)('cg-empty', className), ...rest, children: [icon && (0, jsx_runtime_1.jsx)("div", { className: "cg-empty__icon", children: icon }), (0, jsx_runtime_1.jsx)("h3", { className: "cg-empty__title", children: title }), text != null && (0, jsx_runtime_1.jsx)("p", { className: "cg-empty__text", children: text }), action && (0, jsx_runtime_1.jsx)("div", { className: "cg-empty__action", children: action })] }));
}
