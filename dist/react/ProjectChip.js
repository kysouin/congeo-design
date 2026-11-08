"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectChip = ProjectChip;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_js_1 = require("./cx.js");
const types_js_1 = require("./types.js");
/** Mono project number chip: «0637». */
function ProjectChip({ number, accent, className, ...rest }) {
    return ((0, jsx_runtime_1.jsx)("span", { className: (0, cx_js_1.cx)('cg-chip', accent && 'cg-chip--tint', className), ...(0, types_js_1.accentAttrs)(accent), ...rest, children: String(number) }));
}
