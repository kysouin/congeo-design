import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { Field } from './Input.js';
import { Button, IconButton } from './Button.js';
import { DatePicker } from './DatePicker.js';
import { L } from '../i18n/core.js';
import { addDays, dayOf, maskDate, maskTime, parseDate, parseTime, showDate, timeOptions } from '../i18n/dates.js';
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
const CalendarIcon = () => (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("path", { d: "M8 2v4M16 2v4M3 10h18" }), _jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" })] }));
const ClockIcon = () => (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M12 6v6l4 2" })] }));
/**
 * A date typed as ΗΗ/ΜΜ/ΕΕΕΕ whatever the device locale, with a Monday-first picker. The value is ISO.
 * Generalised from calendar's DateField.
 */
export const DateField = React.forwardRef(function DateField({ value, onChange, label, hint, error: errorProp, steps, today: todayProp, className, id: idProp, disabled, onBlur, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    const [text, setText] = React.useState(showDate(value));
    const [bad, setBad] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const wrap = React.useRef(null);
    React.useLayoutEffect(() => {
        setText(showDate(value));
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
        const iso = parseDate(t);
        setBad(!iso);
        if (iso)
            onChange(iso);
    };
    const today = todayProp !== null && todayProp !== void 0 ? todayProp : dayOf();
    const error = errorProp !== null && errorProp !== void 0 ? errorProp : (bad ? L('Not a valid date (DD/MM/YYYY)', 'Μη έγκυρη ημερομηνία (ΗΗ/ΜΜ/ΕΕΕΕ)') : undefined);
    return (_jsx(Field, { label: label, hint: hint, error: error, id: id, children: _jsxs("div", { ref: wrap, className: cx('cg-datefield', steps && 'cg-datefield--steps', className), children: [_jsx("input", { ref: ref, id: id, className: "cg-input cg-input--mono", inputMode: "numeric", autoComplete: "off", placeholder: L('DD/MM/YYYY', 'ΗΗ/ΜΜ/ΕΕΕΕ'), value: text, disabled: disabled, "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, onChange: (e) => {
                        const t = maskDate(e.target.value);
                        setText(t);
                        if (t.length === 10)
                            commit(t);
                    }, onBlur: (e) => {
                        commit(text);
                        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                    }, ...rest }), _jsx(IconButton, { variant: "secondary", label: L('Pick a date', 'Επιλογή ημερομηνίας'), "aria-expanded": open, "aria-haspopup": "dialog", disabled: disabled, onClick: () => setOpen((o) => !o), children: _jsx(CalendarIcon, {}) }), steps && (_jsxs(_Fragment, { children: [_jsx(Button, { size: "sm", disabled: disabled, "aria-label": L('One day earlier', 'Μία ημέρα πριν'), onClick: () => onChange(addDays(value || today, -1)), children: "\u2039" }), _jsx(Button, { size: "sm", disabled: disabled, "aria-label": L('One day later', 'Μία ημέρα μετά'), onClick: () => onChange(addDays(value || today, 1)), children: "\u203A" }), _jsx(Button, { size: "sm", disabled: disabled, onClick: () => onChange(today), children: L('Today', 'Σήμερα') })] })), open && (_jsx("div", { className: "cg-popover", role: "dialog", "aria-label": L('Pick a date', 'Επιλογή ημερομηνίας'), children: _jsx(DatePicker, { value: value, today: today, onPick: (d) => {
                            setText(showDate(d));
                            setBad(false);
                            setOpen(false);
                            onChange(d);
                        } }) }))] }) }));
});
/** A 24-hour time typed as ΩΩ:ΛΛ whatever the device locale, with a 5-minute list. The value is HH:mm. */
export const TimeField = React.forwardRef(function TimeField({ value, onChange, label, hint, error: errorProp, step = 5, className, id: idProp, disabled, onBlur, ...rest }, ref) {
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
        const v = parseTime(t);
        setBad(v === null);
        if (v !== null) {
            onChange(v);
            setText(v);
        }
    };
    const error = errorProp !== null && errorProp !== void 0 ? errorProp : (bad ? L('Not a valid time (HH:MM, 24-hour)', 'Μη έγκυρη ώρα (ΩΩ:ΛΛ, 24ωρο)') : undefined);
    const options = React.useMemo(() => timeOptions(step), [step]);
    const near = value ? options.find((o) => o >= value) : '09:00';
    return (_jsx(Field, { label: label, hint: hint, error: error, id: id, children: _jsxs("div", { ref: wrap, className: cx('cg-timefield', className), children: [_jsx("input", { ref: ref, id: id, className: "cg-input cg-input--mono", inputMode: "numeric", autoComplete: "off", placeholder: L('HH:MM', 'ΩΩ:ΛΛ'), value: text, disabled: disabled, "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, onChange: (e) => {
                        const t = maskTime(e.target.value);
                        setText(t);
                        if (/^\d{2}:\d{2}$/.test(t))
                            commit(t);
                    }, onBlur: (e) => {
                        commit(text);
                        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                    }, ...rest }), _jsx(IconButton, { variant: "secondary", label: L('Pick a time', 'Επιλογή ώρας'), "aria-expanded": open, "aria-haspopup": "listbox", disabled: disabled, onClick: () => setOpen((o) => !o), children: _jsx(ClockIcon, {}) }), open && (_jsx("div", { className: "cg-popover cg-popover--list", role: "listbox", "aria-label": L('Pick a time', 'Επιλογή ώρας'), ref: list, children: options.map((o) => (_jsx("button", { type: "button", role: "option", "aria-selected": o === value, "data-near": o === near || undefined, className: cx('cg-timefield__option cg-mono', o === value && 'cg-timefield__option--selected'), onClick: () => {
                            onChange(o);
                            setText(o);
                            setBad(false);
                            setOpen(false);
                        }, children: o }, o))) }))] }) }));
});
