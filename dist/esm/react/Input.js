import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
/** The label / hint / error chrome around a control. The control must carry `id`. */
export function Field({ label, hint, error, id, children }) {
    const hasChrome = label != null || hint != null || error != null;
    if (!hasChrome)
        return _jsx(_Fragment, { children: children });
    return (_jsxs("div", { className: cx('cg-field', error != null && 'cg-field--error'), children: [label != null && (_jsx("label", { className: "cg-field__label", htmlFor: id, children: label })), children, (error !== null && error !== void 0 ? error : hint) != null && (_jsx("span", { className: "cg-field__hint", id: `${id}-hint`, children: error !== null && error !== void 0 ? error : hint }))] }));
}
export const Input = React.forwardRef(function Input({ label, hint, error, mono, className, id: idProp, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    return (_jsx(Field, { label: label, hint: hint, error: error, id: id, children: _jsx("input", { ref: ref, id: id, className: cx('cg-input', mono && 'cg-input--mono', className), "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, ...rest }) }));
});
/** Textarea that grows with its text. */
export const Textarea = React.forwardRef(function Textarea({ label, hint, error, maxRows = 8, className, id: idProp, onInput, onKeyDown, onSubmit, rows = 1, style, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    const inner = React.useRef(null);
    const resize = React.useCallback(() => {
        const el = inner.current;
        if (!el)
            return;
        el.style.height = 'auto';
        const cs = getComputedStyle(el);
        const line = parseFloat(cs.lineHeight) || 22;
        const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        const max = line * maxRows + pad;
        const next = Math.min(el.scrollHeight, max);
        el.style.height = `${next}px`;
        el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
    }, [maxRows]);
    React.useLayoutEffect(() => {
        resize();
    });
    return (_jsx(Field, { label: label, hint: hint, error: error, id: id, children: _jsx("textarea", { ref: (el) => {
                inner.current = el;
                if (typeof ref === 'function')
                    ref(el);
                else if (ref)
                    ref.current = el;
            }, id: id, rows: rows, className: cx('cg-textarea', className), "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, style: style, onInput: (e) => {
                onInput === null || onInput === void 0 ? void 0 : onInput(e);
                resize();
            }, onKeyDown: (e) => {
                onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
                if (onSubmit && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && !e.defaultPrevented) {
                    e.preventDefault();
                    onSubmit();
                }
            }, enterKeyHint: onSubmit ? 'done' : undefined, ...rest }) }));
});
