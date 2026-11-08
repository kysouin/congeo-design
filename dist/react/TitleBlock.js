"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleBlock = TitleBlock;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_1 = require("./cx");
const core_js_1 = require("../i18n/core.js");
const defaultLabels = () => ({ number: (0, core_js_1.L)('Project', 'Έργο'), name: (0, core_js_1.L)('Title', 'Τίτλος'), date: (0, core_js_1.L)('Date', 'Ημερομηνία'), sheet: (0, core_js_1.L)('Sheet', 'Φύλλο') });
/** The drawing title-block header: like the corner of a drawing. */
function TitleBlock({ number, name, date, sheet, labels, className, ...rest }) {
    const l = { ...defaultLabels(), ...labels };
    return ((0, jsx_runtime_1.jsxs)("header", { className: (0, cx_1.cx)('cg-titleblock', className), ...rest, children: [(0, jsx_runtime_1.jsxs)("div", { className: "cg-titleblock__cell", children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-cap cg-titleblock__label", children: l.number }), (0, jsx_runtime_1.jsx)("span", { className: "cg-titleblock__value cg-titleblock__value--mono cg-titleblock__value--lg", children: String(number) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "cg-titleblock__cell", children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-cap cg-titleblock__label", children: l.sheet }), (0, jsx_runtime_1.jsx)("span", { className: "cg-titleblock__value cg-titleblock__value--mono", children: sheet })] }), (0, jsx_runtime_1.jsxs)("div", { className: "cg-titleblock__cell cg-titleblock__cell--wide", children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-cap cg-titleblock__label", children: l.name }), (0, jsx_runtime_1.jsx)("span", { className: "cg-titleblock__value", children: name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "cg-titleblock__cell cg-titleblock__cell--wide", children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-cap cg-titleblock__label", children: l.date }), (0, jsx_runtime_1.jsx)("span", { className: "cg-titleblock__value cg-mono", children: date })] })] }));
}
