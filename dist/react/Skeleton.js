"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skeleton = Skeleton;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_js_1 = require("./cx.js");
function Skeleton({ variant = 'text', width, height, className, style, ...rest }) {
    return ((0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: (0, cx_js_1.cx)('cg-skeleton', `cg-skeleton--${variant}`, className), style: { width, height, ...style }, ...rest }));
}
