"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBar = TabBar;
exports.TabBarSpacer = TabBarSpacer;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_1 = require("./cx");
const core_js_1 = require("../i18n/core.js");
/** Floating, safe-area aware tab bar with 4 items. */
function TabBar({ items, value, onChange, inline, label, className, ...rest }) {
    return ((0, jsx_runtime_1.jsx)("nav", { "aria-label": label !== null && label !== void 0 ? label : (0, core_js_1.L)('Navigation', 'Πλοήγηση'), className: (0, cx_1.cx)('cg-tabbar', inline && 'cg-tabbar--inline', className), ...rest, children: items.slice(0, 4).map((it) => {
            const active = it.key === value;
            const Tag = it.href ? 'a' : 'button';
            return ((0, jsx_runtime_1.jsxs)(Tag, { href: it.href, type: it.href ? undefined : 'button', "aria-current": active ? 'page' : undefined, className: "cg-tabbar__item", onClick: () => onChange === null || onChange === void 0 ? void 0 : onChange(it.key), children: [it.icon, (0, jsx_runtime_1.jsx)("span", { className: "cg-tabbar__label", children: it.label })] }, it.key));
        }) }));
}
/** Reserves space at the end of a scrolling screen so content is not hidden under the floating bar. */
function TabBarSpacer() {
    return (0, jsx_runtime_1.jsx)("div", { className: "cg-tabbar-spacer", "aria-hidden": "true" });
}
