import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
import { L } from '../i18n/core.js';
/** Floating, safe-area aware tab bar with 4 items. */
export function TabBar({ items, value, onChange, inline, label, className, ...rest }) {
    return (_jsx("nav", { "aria-label": label !== null && label !== void 0 ? label : L('Navigation', 'Πλοήγηση'), className: cx('cg-tabbar', inline && 'cg-tabbar--inline', className), ...rest, children: items.slice(0, 4).map((it) => {
            const active = it.key === value;
            const Tag = it.href ? 'a' : 'button';
            return (_jsxs(Tag, { href: it.href, type: it.href ? undefined : 'button', "aria-current": active ? 'page' : undefined, className: "cg-tabbar__item", onClick: () => onChange === null || onChange === void 0 ? void 0 : onChange(it.key), children: [it.icon, _jsx("span", { className: "cg-tabbar__label", children: it.label })] }, it.key));
        }) }));
}
/** Reserves space at the end of a scrolling screen so content is not hidden under the floating bar. */
export function TabBarSpacer() {
    return _jsx("div", { className: "cg-tabbar-spacer", "aria-hidden": "true" });
}
