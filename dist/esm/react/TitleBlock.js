import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
import { L } from '../i18n/core.js';
/**
 * The drawing title-block header, like the corner of a drawing. Desktop: one row. Phone: two columns, with
 * the project number first and full-width. 4 to 6 cells.
 */
export function TitleBlock({ number, name, date, sheet, labels, extra, cells: cellsProp, className, style, ...rest }) {
    const l = { number: L('Project', 'Έργο'), name: L('Title', 'Τίτλος'), date: L('Date', 'Ημερομηνία'), sheet: L('Sheet', 'Φύλλο'), ...labels };
    const cells = cellsProp !== null && cellsProp !== void 0 ? cellsProp : [
        name != null && { label: l.name, value: name, wide: true },
        date != null && { label: l.date, value: date, mono: true },
        sheet != null && { label: l.sheet, value: sheet, mono: true },
        ...(extra !== null && extra !== void 0 ? extra : []),
    ].filter(Boolean);
    const all = [{ label: l.number, value: String(number), mono: true, large: true, className: 'cg-titleblock__cell--number' }, ...cells];
    return (_jsx("header", { className: cx('cg-titleblock', className), style: { ...style, ['--cg-tb-cols']: all.length }, "data-cells": all.length, ...rest, children: all.map((c, i) => (_jsxs("div", { className: cx('cg-titleblock__cell', c.wide && 'cg-titleblock__cell--wide', c.className), children: [_jsx("span", { className: "cg-cap cg-titleblock__label", children: c.label }), _jsx("span", { className: cx('cg-titleblock__value', c.mono && 'cg-titleblock__value--mono', c.large && 'cg-titleblock__value--lg'), children: c.value })] }, i))) }));
}
