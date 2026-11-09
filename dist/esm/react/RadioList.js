import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
/** A vertical list of options with label, description and trailing mark. radiogroup; arrow keys move the selection. */
export function RadioList({ options, value, onChange, label, className, ...rest }) {
    const refs = React.useRef([]);
    const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    const onKeyDown = (e) => {
        var _a;
        const cur = options.findIndex((o) => o.value === value);
        const pos = enabled.indexOf(cur);
        let next = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight')
            next = enabled[(pos + 1) % enabled.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
            next = enabled[(pos - 1 + enabled.length) % enabled.length];
        if (e.key === 'Home')
            next = enabled[0];
        if (e.key === 'End')
            next = enabled[enabled.length - 1];
        if (next !== undefined && next >= 0) {
            e.preventDefault();
            onChange(options[next].value);
            (_a = refs.current[next]) === null || _a === void 0 ? void 0 : _a.focus();
        }
    };
    const firstTab = value == null ? enabled[0] : -1;
    return (_jsx("div", { role: "radiogroup", "aria-label": label, className: cx('cg-radiolist', className), onKeyDown: onKeyDown, ...rest, children: options.map((o, i) => {
            const selected = o.value === value;
            return (_jsxs("button", { ref: (el) => {
                    refs.current[i] = el;
                }, type: "button", role: "radio", "aria-checked": selected, disabled: o.disabled, tabIndex: selected || i === firstTab ? 0 : -1, className: cx('cg-radio', selected && 'cg-radio--selected'), onClick: () => onChange(o.value), children: [_jsx("span", { className: "cg-radio__dot", "aria-hidden": "true" }), _jsxs("span", { className: "cg-radio__text", children: [_jsx("span", { className: "cg-radio__label", children: o.label }), o.description != null && _jsx("span", { className: "cg-radio__desc", children: o.description })] }), o.mark != null && _jsx("span", { className: "cg-radio__mark", children: o.mark })] }, o.value));
        }) }));
}
