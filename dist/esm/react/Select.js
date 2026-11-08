import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { Field } from './Input.js';
/**
 * A native <select> in the Input chrome with a Lucide chevron. It never becomes a custom listbox, so the
 * iPhone keeps its native wheel. Pass <option> children.
 */
export const Select = React.forwardRef(function Select({ label, hint, error, className, id: idProp, children, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    return (_jsx(Field, { label: label, hint: hint, error: error, id: id, children: _jsxs("span", { className: cx('cg-select-wrap', rest.disabled && 'cg-select-wrap--disabled'), children: [_jsx("select", { ref: ref, id: id, className: cx('cg-input', 'cg-select', className), "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, ...rest, children: children }), _jsx("svg", { className: "cg-select__chevron", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "m6 9 6 6 6-6" }) })] }) }));
});
