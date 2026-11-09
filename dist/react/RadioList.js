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
exports.RadioList = RadioList;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_js_1 = require("./cx.js");
/** A vertical list of options with label, description and trailing mark. radiogroup; arrow keys move the selection. */
function RadioList({ options, value, onChange, label, className, ...rest }) {
    const refs = React.useRef([]);
    const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    const onKeyDown = (e) => {
        var _a;
        const cur = options.findIndex((o) => o.value === value);
        const pos = enabled.indexOf(cur);
        let next = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight')
            next = enabled[(pos + 1) % enabled.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
            next = enabled[(pos - 1 + enabled.length) % enabled.length];
        if (e.key === 'Home')
            next = enabled[0];
        if (e.key === 'End')
            next = enabled[enabled.length - 1];
        if (next !== undefined && next >= 0) {
            e.preventDefault();
            onChange(options[next].value);
            (_a = refs.current[next]) === null || _a === void 0 ? void 0 : _a.focus();
        }
    };
    const firstTab = value == null ? enabled[0] : -1;
    return ((0, jsx_runtime_1.jsx)("div", { role: "radiogroup", "aria-label": label, className: (0, cx_js_1.cx)('cg-radiolist', className), onKeyDown: onKeyDown, ...rest, children: options.map((o, i) => {
            const selected = o.value === value;
            return ((0, jsx_runtime_1.jsxs)("button", { ref: (el) => {
                    refs.current[i] = el;
                }, type: "button", role: "radio", "aria-checked": selected, disabled: o.disabled, tabIndex: selected || i === firstTab ? 0 : -1, className: (0, cx_js_1.cx)('cg-radio', selected && 'cg-radio--selected'), onClick: () => onChange(o.value), children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-radio__dot", "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("span", { className: "cg-radio__text", children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-radio__label", children: o.label }), o.description != null && (0, jsx_runtime_1.jsx)("span", { className: "cg-radio__desc", children: o.description })] }), o.mark != null && (0, jsx_runtime_1.jsx)("span", { className: "cg-radio__mark", children: o.mark })] }, o.value));
        }) }));
}
