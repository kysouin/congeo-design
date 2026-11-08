import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { accentAttrs } from './types.js';
/** Filter pill with a dot and a count. Toggle via aria-pressed. */
export const FilterPill = React.forwardRef(function FilterPill({ active, dot, count, className, children, type = 'button', ...rest }, ref) {
    return (_jsxs("button", { ref: ref, type: type, "aria-pressed": !!active, className: cx('cg-pill', className), ...accentAttrs(dot), ...rest, children: [dot && _jsx("span", { className: "cg-pill__dot", "aria-hidden": "true" }), _jsx("span", { className: "cg-pill__label", children: children }), count != null && _jsx("span", { className: "cg-pill__count", children: count })] }));
});
export function FilterPills({ className, ...rest }) {
    return _jsx("div", { className: cx('cg-pills', className), ...rest });
}
