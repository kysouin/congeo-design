import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
/** An on/off control with label and description. role="switch", 44 px target, Space and Enter toggle. */
export const Switch = React.forwardRef(function Switch({ checked, onChange, label, description, className, id: idProp, disabled, onClick, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    return (_jsxs("button", { ref: ref, type: "button", role: "switch", id: id, "aria-checked": checked, "aria-describedby": description != null ? `${id}-desc` : undefined, disabled: disabled, className: cx('cg-switch', className), onClick: (e) => {
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
            if (!e.defaultPrevented)
                onChange(!checked);
        }, ...rest, children: [_jsxs("span", { className: "cg-switch__text", children: [_jsx("span", { className: "cg-switch__label", children: label }), description != null && (_jsx("span", { className: "cg-switch__desc", id: `${id}-desc`, children: description }))] }), _jsx("span", { className: "cg-switch__track", "aria-hidden": "true", children: _jsx("span", { className: "cg-switch__thumb" }) })] }));
});
