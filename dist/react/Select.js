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
exports.Select = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_js_1 = require("./cx.js");
const Input_js_1 = require("./Input.js");
/**
 * A native <select> in the Input chrome with a Lucide chevron. It never becomes a custom listbox, so the
 * iPhone keeps its native wheel. Pass <option> children.
 */
exports.Select = React.forwardRef(function Select({ label, hint, error, className, id: idProp, children, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    return ((0, jsx_runtime_1.jsx)(Input_js_1.Field, { label: label, hint: hint, error: error, id: id, children: (0, jsx_runtime_1.jsxs)("span", { className: (0, cx_js_1.cx)('cg-select-wrap', rest.disabled && 'cg-select-wrap--disabled'), children: [(0, jsx_runtime_1.jsx)("select", { ref: ref, id: id, className: (0, cx_js_1.cx)('cg-input', 'cg-select', className), "aria-invalid": error != null || undefined, "aria-describedby": (error !== null && error !== void 0 ? error : hint) != null ? `${id}-hint` : undefined, ...rest, children: children }), (0, jsx_runtime_1.jsx)("svg", { className: "cg-select__chevron", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("path", { d: "m6 9 6 6 6-6" }) })] }) }));
});
