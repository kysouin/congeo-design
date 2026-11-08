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
exports.Segmented = Segmented;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_1 = require("./cx");
/** Segmented control: Εβδομάδα | Μήνας. Arrow keys move the selection. */
function Segmented({ options, value, onChange, block, label, className, ...rest }) {
    const refs = React.useRef([]);
    const onKeyDown = (e) => {
        var _a;
        const i = options.findIndex((o) => o.value === value);
        let next = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
            next = (i + 1) % options.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
            next = (i - 1 + options.length) % options.length;
        if (e.key === 'Home')
            next = 0;
        if (e.key === 'End')
            next = options.length - 1;
        if (next >= 0) {
            e.preventDefault();
            onChange(options[next].value);
            (_a = refs.current[next]) === null || _a === void 0 ? void 0 : _a.focus();
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { role: "radiogroup", "aria-label": label, className: (0, cx_1.cx)('cg-seg', block && 'cg-seg--block', className), onKeyDown: onKeyDown, ...rest, children: options.map((o, i) => {
            const selected = o.value === value;
            return ((0, jsx_runtime_1.jsx)("button", { ref: (el) => {
                    refs.current[i] = el;
                }, type: "button", role: "radio", "aria-checked": selected, tabIndex: selected ? 0 : -1, className: "cg-seg__item", onClick: () => onChange(o.value), children: o.label }, o.value));
        }) }));
}
