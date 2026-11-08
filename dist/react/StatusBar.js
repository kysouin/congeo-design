"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = StatusBar;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_1 = require("./cx");
const DEFAULT_LABELS = {
    offline: 'Εκτός σύνδεσης',
    sending: 'Αποστολή',
    failed: 'Αποτυχία αποστολής',
};
/** Sync status: offline, sending, failed, with a count. */
function StatusBar({ state, count, labels, className, children, ...rest }) {
    const text = children !== null && children !== void 0 ? children : { ...DEFAULT_LABELS, ...labels }[state];
    return ((0, jsx_runtime_1.jsxs)("div", { role: "status", className: (0, cx_1.cx)('cg-statusbar', `cg-statusbar--${state}`, className), ...rest, children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-statusbar__dot", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { className: "cg-statusbar__text", children: text }), count != null && (0, jsx_runtime_1.jsx)("span", { className: "cg-statusbar__count", children: count })] }));
}
