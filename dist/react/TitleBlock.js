"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleBlock = TitleBlock;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_js_1 = require("./cx.js");
const core_js_1 = require("../i18n/core.js");
/**
 * The drawing title-block header, like the corner of a drawing. Desktop: one row. Phone: two columns, with
 * the project number first and full-width. 4 to 6 cells.
 */
function TitleBlock({ number, name, date, sheet, labels, extra, cells: cellsProp, className, style, ...rest }) {
    const l = { number: (0, core_js_1.L)('Project', 'Έργο'), name: (0, core_js_1.L)('Title', 'Τίτλος'), date: (0, core_js_1.L)('Date', 'Ημερομηνία'), sheet: (0, core_js_1.L)('Sheet', 'Φύλλο'), ...labels };
    const cells = cellsProp !== null && cellsProp !== void 0 ? cellsProp : [
        name != null && { label: l.name, value: name, wide: true },
        date != null && { label: l.date, value: date, mono: true },
        sheet != null && { label: l.sheet, value: sheet, mono: true },
        ...(extra !== null && extra !== void 0 ? extra : []),
    ].filter(Boolean);
    const all = [{ label: l.number, value: String(number), mono: true, large: true, className: 'cg-titleblock__cell--number' }, ...cells];
    return ((0, jsx_runtime_1.jsx)("header", { className: (0, cx_js_1.cx)('cg-titleblock', className), style: { ...style, ['--cg-tb-cols']: all.length }, "data-cells": all.length, ...rest, children: all.map((c, i) => ((0, jsx_runtime_1.jsxs)("div", { className: (0, cx_js_1.cx)('cg-titleblock__cell', c.wide && 'cg-titleblock__cell--wide', c.className), children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-cap cg-titleblock__label", children: c.label }), (0, jsx_runtime_1.jsx)("span", { className: (0, cx_js_1.cx)('cg-titleblock__value', c.mono && 'cg-titleblock__value--mono', c.large && 'cg-titleblock__value--lg'), children: c.value })] }, i))) }));
}
