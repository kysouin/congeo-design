import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { IconButton } from './Button.js';
import { L } from '../i18n/core.js';
import { addMonths, dayHeads, dayOf, monthGrid, monthOf, monthTitle } from '../i18n/dates.js';
const Chevron = ({ dir }) => (_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: dir === 'l' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6' }) }));
/** A Monday-first month grid with year and month steps. Generalised from calendar's DatePicker. */
export function DatePicker({ value, onPick, today: todayProp, className, ...rest }) {
    const today = todayProp !== null && todayProp !== void 0 ? todayProp : dayOf();
    const [month, setMonth] = React.useState(monthOf(value || today));
    React.useEffect(() => {
        if (value)
            setMonth(monthOf(value));
    }, [value]);
    const year = month.slice(0, 4);
    const cells = monthGrid(month);
    const heads = dayHeads();
    return (_jsxs("div", { className: cx('cg-datepicker', className), ...rest, children: [_jsxs("div", { className: "cg-datepicker__steps", children: [_jsxs("div", { className: "cg-datepicker__step", role: "group", "aria-label": L('Year', 'Έτος'), children: [_jsx(IconButton, { variant: "ghost", label: L('Previous year', 'Προηγούμενο έτος'), onClick: () => setMonth(addMonths(month, -12)), children: _jsx(Chevron, { dir: "l" }) }), _jsx("span", { className: "cg-datepicker__label cg-mono", children: year }), _jsx(IconButton, { variant: "ghost", label: L('Next year', 'Επόμενο έτος'), onClick: () => setMonth(addMonths(month, 12)), children: _jsx(Chevron, { dir: "r" }) })] }), _jsxs("div", { className: "cg-datepicker__step", role: "group", "aria-label": L('Month', 'Μήνας'), children: [_jsx(IconButton, { variant: "ghost", label: L('Previous month', 'Προηγούμενος μήνας'), onClick: () => setMonth(addMonths(month, -1)), children: _jsx(Chevron, { dir: "l" }) }), _jsx("span", { className: "cg-datepicker__label", children: monthTitle(month) }), _jsx(IconButton, { variant: "ghost", label: L('Next month', 'Επόμενος μήνας'), onClick: () => setMonth(addMonths(month, 1)), children: _jsx(Chevron, { dir: "r" }) })] })] }), _jsxs("div", { className: "cg-datepicker__grid", role: "grid", "aria-label": monthTitle(month), children: [heads.map((h) => (_jsx("div", { className: "cg-datepicker__head", role: "columnheader", children: h }, h))), cells.map((d) => (_jsx("button", { type: "button", role: "gridcell", "aria-selected": d === value || undefined, "aria-current": d === today ? 'date' : undefined, "aria-label": d, className: cx('cg-datepicker__cell', monthOf(d) !== month && 'cg-datepicker__cell--faded', d === today && 'cg-datepicker__cell--today', d === value && 'cg-datepicker__cell--selected'), onClick: () => onPick(d), children: _jsx("span", { className: "cg-datepicker__num", children: +d.slice(8, 10) }) }, d)))] })] }));
}
