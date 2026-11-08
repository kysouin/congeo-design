"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = StatusBar;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_1 = require("./cx");
const core_js_1 = require("../i18n/core.js");
const defaultLabels = () => ({
    offline: (0, core_js_1.L)('Offline', 'Εκτός σύνδεσης'),
    sending: (0, core_js_1.L)('Sending', 'Αποστολή'),
    failed: (0, core_js_1.L)('Not sent', 'Αποτυχία αποστολής'),
    ok: (0, core_js_1.L)('Sent', 'Στάλθηκαν'),
});
/** Sync status: offline, sending, failed, with a count; ok («3 changes sent») hides itself after 4 s. */
function StatusBar({ state, count, labels, autoHide, persist, onHide, className, children, ...rest }) {
    const delay = persist || autoHide === false ? null : autoHide !== null && autoHide !== void 0 ? autoHide : (state === 'ok' ? 4000 : null);
    const [hidden, setHidden] = React.useState(false);
    const onHideRef = React.useRef(onHide);
    onHideRef.current = onHide;
    React.useEffect(() => {
        setHidden(false);
        if (delay == null)
            return;
        const t = setTimeout(() => {
            var _a;
            setHidden(true);
            (_a = onHideRef.current) === null || _a === void 0 ? void 0 : _a.call(onHideRef);
        }, delay);
        return () => clearTimeout(t);
    }, [delay, state, count, children]);
    if (hidden)
        return null;
    const text = children !== null && children !== void 0 ? children : { ...defaultLabels(), ...labels }[state];
    return ((0, jsx_runtime_1.jsxs)("div", { role: "status", className: (0, cx_1.cx)('cg-statusbar', `cg-statusbar--${state}`, className), ...rest, children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-statusbar__dot", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { className: "cg-statusbar__text", children: text }), count != null && (0, jsx_runtime_1.jsx)("span", { className: "cg-statusbar__count", children: count })] }));
}
