import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { L } from '../i18n/core.js';
/** 22 px check circle with a 44 px hit area. */
export const CheckCircle = React.forwardRef(function CheckCircle({ checked, overdue, onChange, label, className, onClick, ...rest }, ref) {
    return (_jsx("button", { ref: ref, type: "button", role: "checkbox", "aria-checked": checked, "aria-label": label !== null && label !== void 0 ? label : L('Done', 'Έγινε'), className: cx('cg-check', checked && 'cg-check--checked', overdue && !checked && 'cg-check--overdue', className), onClick: (e) => {
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
            if (!e.defaultPrevented)
                onChange === null || onChange === void 0 ? void 0 : onChange(!checked);
        }, ...rest, children: _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M5 12.5l4.5 4.5L19 7.5" }) }) }));
});
