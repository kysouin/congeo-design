"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = Card;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_js_1 = require("./cx.js");
const types_js_1 = require("./types.js");
function Card({ size = 'md', raised, flat, tint, title, as = 'div', className, children, ...rest }) {
    const Tag = as;
    return ((0, jsx_runtime_1.jsxs)(Tag, { className: (0, cx_js_1.cx)('cg-card', size === 'lg' && 'cg-card--lg', raised && 'cg-card--raised', flat && 'cg-card--flat', tint && 'cg-card--tint', className), ...(0, types_js_1.accentAttrs)(tint), ...rest, children: [title != null && (0, jsx_runtime_1.jsx)("h3", { className: "cg-card__title", children: title }), children] }));
}
