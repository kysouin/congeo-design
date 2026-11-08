"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePicker = DatePicker;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_1 = require("./cx");
const Button_1 = require("./Button");
const core_js_1 = require("../i18n/core.js");
const dates_js_1 = require("../i18n/dates.js");
const Chevron = ({ dir }) => ((0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("path", { d: dir === 'l' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6' }) }));
/** A Monday-first month grid with year and month steps. Generalised from calendar's DatePicker. */
function DatePicker({ value, onPick, today: todayProp, className, ...rest }) {
    const today = todayProp !== null && todayProp !== void 0 ? todayProp : (0, dates_js_1.dayOf)();
    const [month, setMonth] = React.useState((0, dates_js_1.monthOf)(value || today));
    React.useEffect(() => {
        if (value)
            setMonth((0, dates_js_1.monthOf)(value));
    }, [value]);
    const year = month.slice(0, 4);
    const cells = (0, dates_js_1.monthGrid)(month);
    const heads = (0, dates_js_1.dayHeads)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, cx_1.cx)('cg-datepicker', className), ...rest, children: [(0, jsx_runtime_1.jsxs)("div", { className: "cg-datepicker__steps", children: [(0, jsx_runtime_1.jsxs)("div", { className: "cg-datepicker__step", role: "group", "aria-label": (0, core_js_1.L)('Year', 'Έτος'), children: [(0, jsx_runtime_1.jsx)(Button_1.IconButton, { variant: "ghost", label: (0, core_js_1.L)('Previous year', 'Προηγούμενο έτος'), onClick: () => setMonth((0, dates_js_1.addMonths)(month, -12)), children: (0, jsx_runtime_1.jsx)(Chevron, { dir: "l" }) }), (0, jsx_runtime_1.jsx)("span", { className: "cg-datepicker__label cg-mono", children: year }), (0, jsx_runtime_1.jsx)(Button_1.IconButton, { variant: "ghost", label: (0, core_js_1.L)('Next year', 'Επόμενο έτος'), onClick: () => setMonth((0, dates_js_1.addMonths)(month, 12)), children: (0, jsx_runtime_1.jsx)(Chevron, { dir: "r" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "cg-datepicker__step", role: "group", "aria-label": (0, core_js_1.L)('Month', 'Μήνας'), children: [(0, jsx_runtime_1.jsx)(Button_1.IconButton, { variant: "ghost", label: (0, core_js_1.L)('Previous month', 'Προηγούμενος μήνας'), onClick: () => setMonth((0, dates_js_1.addMonths)(month, -1)), children: (0, jsx_runtime_1.jsx)(Chevron, { dir: "l" }) }), (0, jsx_runtime_1.jsx)("span", { className: "cg-datepicker__label", children: (0, dates_js_1.monthTitle)(month) }), (0, jsx_runtime_1.jsx)(Button_1.IconButton, { variant: "ghost", label: (0, core_js_1.L)('Next month', 'Επόμενος μήνας'), onClick: () => setMonth((0, dates_js_1.addMonths)(month, 1)), children: (0, jsx_runtime_1.jsx)(Chevron, { dir: "r" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "cg-datepicker__grid", role: "grid", "aria-label": (0, dates_js_1.monthTitle)(month), children: [heads.map((h) => ((0, jsx_runtime_1.jsx)("div", { className: "cg-datepicker__head", role: "columnheader", children: h }, h))), cells.map((d) => ((0, jsx_runtime_1.jsx)("button", { type: "button", role: "gridcell", "aria-selected": d === value || undefined, "aria-current": d === today ? 'date' : undefined, "aria-label": d, className: (0, cx_1.cx)('cg-datepicker__cell', (0, dates_js_1.monthOf)(d) !== month && 'cg-datepicker__cell--faded', d === today && 'cg-datepicker__cell--today', d === value && 'cg-datepicker__cell--selected'), onClick: () => onPick(d), children: (0, jsx_runtime_1.jsx)("span", { className: "cg-datepicker__num", children: +d.slice(8, 10) }) }, d)))] })] }));
}
