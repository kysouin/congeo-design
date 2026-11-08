import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
/** Segmented control: Εβδομάδα | Μήνας. Arrow keys move the selection. */
export function Segmented({ options, value, onChange, block, label, className, ...rest }) {
    const refs = React.useRef([]);
    const onKeyDown = (e) => {
        var _a;
        const i = options.findIndex((o) => o.value === value);
        let next = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
            next = (i + 1) % options.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
            next = (i - 1 + options.length) % options.length;
        if (e.key === 'Home')
            next = 0;
        if (e.key === 'End')
            next = options.length - 1;
        if (next >= 0) {
            e.preventDefault();
            onChange(options[next].value);
            (_a = refs.current[next]) === null || _a === void 0 ? void 0 : _a.focus();
        }
    };
    return (_jsx("div", { role: "radiogroup", "aria-label": label, className: cx('cg-seg', block && 'cg-seg--block', className), onKeyDown: onKeyDown, ...rest, children: options.map((o, i) => {
            const selected = o.value === value;
            return (_jsx("button", { ref: (el) => {
                    refs.current[i] = el;
                }, type: "button", role: "radio", "aria-checked": selected, tabIndex: selected ? 0 : -1, className: "cg-seg__item", onClick: () => onChange(o.value), children: o.label }, o.value));
        }) }));
}
