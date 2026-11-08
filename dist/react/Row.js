"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = Row;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_js_1 = require("./cx.js");
const core_js_1 = require("../i18n/core.js");
const types_js_1 = require("./types.js");
function Row({ title, meta, accent, pending, done, lead, trail, as, href, className, children, ...rest }) {
    const Tag = as !== null && as !== void 0 ? as : (href ? 'a' : 'div');
    return ((0, jsx_runtime_1.jsxs)(Tag, { className: (0, cx_js_1.cx)('cg-row', accent && 'cg-row--accent', done && 'cg-row--done', className), href: href, ...(0, types_js_1.accentAttrs)(accent), ...rest, children: [accent && (0, jsx_runtime_1.jsx)("span", { className: "cg-row__accent", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { className: "cg-row__lead", children: lead }), (0, jsx_runtime_1.jsxs)("span", { className: "cg-row__body", children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-row__title", children: title }), meta != null && (0, jsx_runtime_1.jsx)("span", { className: "cg-row__meta", children: meta }), children] }), (0, jsx_runtime_1.jsxs)("span", { className: "cg-row__trail", children: [pending && (0, jsx_runtime_1.jsx)("span", { className: "cg-row__pending", role: "img", "aria-label": (0, core_js_1.L)('Pending', 'Εκκρεμεί') }), trail] })] }));
}
