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
exports.TimeField = exports.DateField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_js_1 = require("./cx.js");
const Input_js_1 = require("./Input.js");
const Button_js_1 = require("./Button.js");
const DatePicker_js_1 = require("./DatePicker.js");
const core_js_1 = require("../i18n/core.js");
const dates_js_1 = require("../i18n/dates.js");
function usePopover(onClose, open, ref) {
    React.useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                onClose();
        };
        const onKey = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('pointerdown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose, ref]);
}
const CalendarIcon = () => ((0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [(0, jsx_runtime_1.jsx)("path", { d: "M8 2v4M16 2v4M3 10h18" }), (0, jsx_runtime_1.jsx)("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" })] }));
const ClockIcon = () => ((0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [(0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "12", r: "10" }), (0, jsx_runtime_1.jsx)("path", { d: "M12 6v6l4 2" })] }));
/**
 * A date typed as ΗΗ/ΜΜ/ΕΕΕΕ whatever the device locale, with a Monday-first picker. The value is ISO.
 * Generalised from calendar's DateField.
 */
exports.DateField = React.forwardRef(function DateField({ value, onChange, label, hint, error: errorProp, steps, today: todayProp, className, id: idProp, disabled, onBlur, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    const [text, setText] = React.useState((0, dates_js_1.showDate)(value));
    const [bad, setBad] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const wrap = React.useRef(null);
    React.useLayoutEffect(() => {
        setText((0, dates_js_1.showDate)(value));
        if (value)
            setBad(false);
    }, [value]);
    const close = React.useCallback(() => setOpen(false), []);
    usePopover(close, open, wrap);
    const commit = (t) => {
        if (!t.trim()) {
            setBad(false);
            onChange('');
            return;
        }
        const iso = (0, dates_js_1.parseDate)(t);
        setBad(!iso);
        if (iso)
            onChange(iso);
    };
    const today = todayProp !== null && todayProp !== void 0 ? todayProp : (0, dates_js_1.dayOf)();
    const error = errorProp !== null && errorProp !== void 0 ? errorProp : (bad ? (0, core_js_1.L)('Not a valid date (DD/MM/YYYY)', 'Μη έγκυρη ημερομηνία (ΗΗ/ΜΜ/ΕΕΕΕ)') : undefined);
    return ((0, jsx_runtime_1.jsx)(Input_js_1.Field, { label: label, hint: hint, error: error, id: id, children: (0, jsx_runtime_1.jsxs)("div", { ref: wrap, className: (0, cx_js_1.cx)('cg-datefield', steps && 'cg-datefield--steps', className), children: [(0, jsx_runtime_1.jsx)("input", { ref: ref, id: id, className: "cg-input cg-input--mono", inputMode: "numeric", autoComplete: "off", placeholder: (0, core_js_1.L)('DD/MM/YYYY', 'ΗΗ/ΜΜ/ΕΕΕΕ'), value: text, disabled: disabled, "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, onChange: (e) => {
                        const t = (0, dates_js_1.maskDate)(e.target.value);
                        setText(t);
                        if (t.length === 10)
                            commit(t);
                    }, onBlur: (e) => {
                        commit(text);
                        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                    }, ...rest }), (0, jsx_runtime_1.jsx)(Button_js_1.IconButton, { variant: "secondary", label: (0, core_js_1.L)('Pick a date', 'Επιλογή ημερομηνίας'), "aria-expanded": open, "aria-haspopup": "dialog", disabled: disabled, onClick: () => setOpen((o) => !o), children: (0, jsx_runtime_1.jsx)(CalendarIcon, {}) }), steps && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_js_1.Button, { size: "sm", disabled: disabled, "aria-label": (0, core_js_1.L)('One day earlier', 'Μία ημέρα πριν'), onClick: () => onChange((0, dates_js_1.addDays)(value || today, -1)), children: "\u2039" }), (0, jsx_runtime_1.jsx)(Button_js_1.Button, { size: "sm", disabled: disabled, "aria-label": (0, core_js_1.L)('One day later', 'Μία ημέρα μετά'), onClick: () => onChange((0, dates_js_1.addDays)(value || today, 1)), children: "\u203A" }), (0, jsx_runtime_1.jsx)(Button_js_1.Button, { size: "sm", disabled: disabled, onClick: () => onChange(today), children: (0, core_js_1.L)('Today', 'Σήμερα') })] })), open && ((0, jsx_runtime_1.jsx)("div", { className: "cg-popover", role: "dialog", "aria-label": (0, core_js_1.L)('Pick a date', 'Επιλογή ημερομηνίας'), children: (0, jsx_runtime_1.jsx)(DatePicker_js_1.DatePicker, { value: value, today: today, onPick: (d) => {
                            setText((0, dates_js_1.showDate)(d));
                            setBad(false);
                            setOpen(false);
                            onChange(d);
                        } }) }))] }) }));
});
/** A 24-hour time typed as ΩΩ:ΛΛ whatever the device locale, with a 5-minute list. The value is HH:mm. */
exports.TimeField = React.forwardRef(function TimeField({ value, onChange, label, hint, error: errorProp, step = 5, className, id: idProp, disabled, onBlur, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    const [text, setText] = React.useState(value);
    const [bad, setBad] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const wrap = React.useRef(null);
    const list = React.useRef(null);
    React.useLayoutEffect(() => {
        setText(value);
        if (value)
            setBad(false);
    }, [value]);
    const close = React.useCallback(() => setOpen(false), []);
    usePopover(close, open, wrap);
    React.useEffect(() => {
        if (!open || !list.current)
            return;
        const sel = list.current.querySelector('[aria-selected="true"]') || list.current.querySelector('[data-near="true"]');
        sel === null || sel === void 0 ? void 0 : sel.scrollIntoView({ block: 'center' });
        sel === null || sel === void 0 ? void 0 : sel.focus();
    }, [open]);
    const commit = (t) => {
        const v = (0, dates_js_1.parseTime)(t);
        setBad(v === null);
        if (v !== null) {
            onChange(v);
            setText(v);
        }
    };
    const error = errorProp !== null && errorProp !== void 0 ? errorProp : (bad ? (0, core_js_1.L)('Not a valid time (HH:MM, 24-hour)', 'Μη έγκυρη ώρα (ΩΩ:ΛΛ, 24ωρο)') : undefined);
    const options = React.useMemo(() => (0, dates_js_1.timeOptions)(step), [step]);
    const near = value ? options.find((o) => o >= value) : '09:00';
    return ((0, jsx_runtime_1.jsx)(Input_js_1.Field, { label: label, hint: hint, error: error, id: id, children: (0, jsx_runtime_1.jsxs)("div", { ref: wrap, className: (0, cx_js_1.cx)('cg-timefield', className), children: [(0, jsx_runtime_1.jsx)("input", { ref: ref, id: id, className: "cg-input cg-input--mono", inputMode: "numeric", autoComplete: "off", placeholder: (0, core_js_1.L)('HH:MM', 'ΩΩ:ΛΛ'), value: text, disabled: disabled, "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, onChange: (e) => {
                        const t = (0, dates_js_1.maskTime)(e.target.value);
                        setText(t);
                        if (/^\d{2}:\d{2}$/.test(t))
                            commit(t);
                    }, onBlur: (e) => {
                        commit(text);
                        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                    }, ...rest }), (0, jsx_runtime_1.jsx)(Button_js_1.IconButton, { variant: "secondary", label: (0, core_js_1.L)('Pick a time', 'Επιλογή ώρας'), "aria-expanded": open, "aria-haspopup": "listbox", disabled: disabled, onClick: () => setOpen((o) => !o), children: (0, jsx_runtime_1.jsx)(ClockIcon, {}) }), open && ((0, jsx_runtime_1.jsx)("div", { className: "cg-popover cg-popover--list", role: "listbox", "aria-label": (0, core_js_1.L)('Pick a time', 'Επιλογή ώρας'), ref: list, children: options.map((o) => ((0, jsx_runtime_1.jsx)("button", { type: "button", role: "option", "aria-selected": o === value, "data-near": o === near || undefined, className: (0, cx_js_1.cx)('cg-timefield__option cg-mono', o === value && 'cg-timefield__option--selected'), onClick: () => {
                            onChange(o);
                            setText(o);
                            setBad(false);
                            setOpen(false);
                        }, children: o }, o))) }))] }) }));
});
