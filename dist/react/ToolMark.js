"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOL_LABELS = void 0;
exports.ToolMark = ToolMark;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_js_1 = require("./cx.js");
exports.TOOL_LABELS = {
    kaneto: 'Kaneto',
    rhoi: 'Rhoi',
    trace: 'Trace',
    permitflow: 'PermitFlow',
    internal: 'CONGEO',
};
/** The tool's colour dot and its name. */
function ToolMark({ tool, label, size = 'md', className, ...rest }) {
    return ((0, jsx_runtime_1.jsxs)("span", { className: (0, cx_js_1.cx)('cg-toolmark', size === 'lg' && 'cg-toolmark--lg', className), "data-tool": tool, ...rest, children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-toolmark__dot", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { className: "cg-toolmark__name", children: label !== null && label !== void 0 ? label : exports.TOOL_LABELS[tool] })] }));
}
