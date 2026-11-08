import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
export function EmptyState({ icon, title, text, action, className, ...rest }) {
    return (_jsxs("div", { className: cx('cg-empty', className), ...rest, children: [icon && _jsx("div", { className: "cg-empty__icon", children: icon }), _jsx("h3", { className: "cg-empty__title", children: title }), text != null && _jsx("p", { className: "cg-empty__text", children: text }), action && _jsx("div", { className: "cg-empty__action", children: action })] }));
}
