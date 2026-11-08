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
exports.Sheet = Sheet;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_1 = require("./cx");
/** Bottom sheet with a grabber. Escape and the backdrop close it. */
function Sheet({ open, onClose, title, inline, className, children, ...rest }) {
    React.useEffect(() => {
        if (!open || inline)
            return;
        const onKey = (e) => {
            if (e.key === 'Escape')
                onClose === null || onClose === void 0 ? void 0 : onClose();
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, inline, onClose]);
    if (!open)
        return null;
    const panel = ((0, jsx_runtime_1.jsxs)("div", { role: "dialog", "aria-modal": !inline, className: (0, cx_1.cx)('cg-sheet', inline && 'cg-sheet--inline', className), ...rest, children: [(0, jsx_runtime_1.jsx)("div", { className: "cg-sheet__grabber", "aria-hidden": "true" }), title != null && (0, jsx_runtime_1.jsx)("h2", { className: "cg-sheet__title", children: title }), children] }));
    if (inline)
        return panel;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "cg-sheet-backdrop", onClick: onClose, "aria-hidden": "true" }), panel] }));
}
