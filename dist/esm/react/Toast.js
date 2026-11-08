import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
/** One toast. Place inside <ToastRegion>. */
export function Toast({ kind = 'info', action, className, children, ...rest }) {
    return (_jsxs("div", { role: "status", className: cx('cg-toast', kind !== 'info' && `cg-toast--${kind}`, className), ...rest, children: [_jsx("span", { className: "cg-toast__icon", "aria-hidden": "true" }), _jsx("span", { className: "cg-toast__text", children: children }), action && (_jsx("button", { type: "button", className: "cg-toast__action", onClick: action.onClick, children: action.label }))] }));
}
/** Fixed at the top, under the safe area. It never covers inputs: the keyboard and the inputs live at the bottom. */
export function ToastRegion({ inline, className, ...rest }) {
    return _jsx("div", { "aria-live": "polite", className: cx('cg-toast-region', inline && 'cg-toast-region--inline', className), ...rest });
}
