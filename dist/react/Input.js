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
exports.Textarea = exports.Input = void 0;
exports.Field = Field;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_1 = require("./cx");
/** The label / hint / error chrome around a control. The control must carry `id`. */
function Field({ label, hint, error, id, children }) {
    const hasChrome = label != null || hint != null || error != null;
    if (!hasChrome)
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, cx_1.cx)('cg-field', error != null && 'cg-field--error'), children: [label != null && ((0, jsx_runtime_1.jsx)("label", { className: "cg-field__label", htmlFor: id, children: label })), children, (error !== null && error !== void 0 ? error : hint) != null && ((0, jsx_runtime_1.jsx)("span", { className: "cg-field__hint", id: `${id}-hint`, children: error !== null && error !== void 0 ? error : hint }))] }));
}
exports.Input = React.forwardRef(function Input({ label, hint, error, mono, className, id: idProp, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    return ((0, jsx_runtime_1.jsx)(Field, { label: label, hint: hint, error: error, id: id, children: (0, jsx_runtime_1.jsx)("input", { ref: ref, id: id, className: (0, cx_1.cx)('cg-input', mono && 'cg-input--mono', className), "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, ...rest }) }));
});
/** Textarea that grows with its text. */
exports.Textarea = React.forwardRef(function Textarea({ label, hint, error, maxRows = 8, className, id: idProp, onInput, onKeyDown, onSubmit, rows = 1, style, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    const inner = React.useRef(null);
    const resize = React.useCallback(() => {
        const el = inner.current;
        if (!el)
            return;
        el.style.height = 'auto';
        const cs = getComputedStyle(el);
        const line = parseFloat(cs.lineHeight) || 22;
        const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        const max = line * maxRows + pad;
        const next = Math.min(el.scrollHeight, max);
        el.style.height = `${next}px`;
        el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
    }, [maxRows]);
    React.useLayoutEffect(() => {
        resize();
    });
    return ((0, jsx_runtime_1.jsx)(Field, { label: label, hint: hint, error: error, id: id, children: (0, jsx_runtime_1.jsx)("textarea", { ref: (el) => {
                inner.current = el;
                if (typeof ref === 'function')
                    ref(el);
                else if (ref)
                    ref.current = el;
            }, id: id, rows: rows, className: (0, cx_1.cx)('cg-textarea', className), "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, style: style, onInput: (e) => {
                onInput === null || onInput === void 0 ? void 0 : onInput(e);
                resize();
            }, onKeyDown: (e) => {
                onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
                if (onSubmit && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && !e.defaultPrevented) {
                    e.preventDefault();
                    onSubmit();
                }
            }, enterKeyHint: onSubmit ? 'done' : undefined, ...rest }) }));
});
