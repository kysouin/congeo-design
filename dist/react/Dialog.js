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
exports.Dialog = Dialog;
exports.SidePanel = SidePanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_js_1 = require("./cx.js");
const Button_js_1 = require("./Button.js");
const Sheet_js_1 = require("./Sheet.js");
const core_js_1 = require("../i18n/core.js");
const focus_js_1 = require("./focus.js");
const CloseIcon = () => ((0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("path", { d: "M18 6 6 18M6 6l12 12" }) }));
/**
 * The right container per screen: a bottom Sheet on a phone, a centred modal from 900 px up. Title, body,
 * footer actions (secondary left, primary right), Escape, backdrop, focus trap and return, on both.
 *
 * Use Dialog for a decision or a short form that interrupts; use SidePanel to edit one item while the list
 * stays in view (calendar's editor).
 */
function Dialog({ open, onClose, title, footer, maxWidth = 560, variant = 'auto', inline, closeButton = true, className, children, style, ...rest }) {
    const desktop = (0, focus_js_1.useMediaQuery)(focus_js_1.DESKTOP_QUERY, false);
    const asModal = variant === 'modal' || (variant === 'auto' && desktop);
    const panel = React.useRef(null);
    (0, focus_js_1.useModalFocus)(open && asModal && !inline, panel, onClose);
    if (!open)
        return null;
    const head = (title != null || closeButton) && ((0, jsx_runtime_1.jsxs)("div", { className: "cg-dialog__head", children: [title != null && (0, jsx_runtime_1.jsx)("h2", { className: "cg-dialog__title", children: title }), closeButton && ((0, jsx_runtime_1.jsx)(Button_js_1.IconButton, { variant: "ghost", size: "sm", label: (0, core_js_1.L)('Close', 'Κλείσιμο'), onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), children: (0, jsx_runtime_1.jsx)(CloseIcon, {}) }))] }));
    const body = (0, jsx_runtime_1.jsx)("div", { className: "cg-dialog__body", children: children });
    const foot = footer && (0, jsx_runtime_1.jsx)("div", { className: "cg-dialog__foot", children: footer });
    if (!asModal) {
        return ((0, jsx_runtime_1.jsxs)(Sheet_js_1.Sheet, { open: true, onClose: onClose, inline: inline, className: (0, cx_js_1.cx)('cg-dialog cg-dialog--sheet', className), style: style, ...rest, children: [head, body, foot] }));
    }
    const modal = ((0, jsx_runtime_1.jsxs)("div", { ref: panel, role: "dialog", "aria-modal": !inline, tabIndex: -1, className: (0, cx_js_1.cx)('cg-dialog cg-dialog--modal', inline && 'cg-dialog--inline', className), style: { ...style, maxWidth }, ...rest, children: [head, body, foot] }));
    if (inline)
        return modal;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "cg-dialog-layer", children: [(0, jsx_runtime_1.jsx)("div", { className: "cg-sheet-backdrop", onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), "aria-hidden": "true" }), modal] }));
}
/**
 * A bottom Sheet on a phone, a right-hand side panel from 900 px up: for editing one item while the rest of
 * the screen stays in view. Same head, body and footer as Dialog.
 */
function SidePanel({ open, onClose, title, footer, width = 420, variant = 'auto', inline, closeButton = true, className, children, style, ...rest }) {
    const desktop = (0, focus_js_1.useMediaQuery)(focus_js_1.DESKTOP_QUERY, false);
    const asPanel = variant === 'panel' || (variant === 'auto' && desktop);
    const panel = React.useRef(null);
    (0, focus_js_1.useModalFocus)(open && asPanel && !inline, panel, onClose);
    if (!open)
        return null;
    const head = (title != null || closeButton) && ((0, jsx_runtime_1.jsxs)("div", { className: "cg-dialog__head", children: [title != null && (0, jsx_runtime_1.jsx)("h2", { className: "cg-dialog__title", children: title }), closeButton && ((0, jsx_runtime_1.jsx)(Button_js_1.IconButton, { variant: "ghost", size: "sm", label: (0, core_js_1.L)('Close', 'Κλείσιμο'), onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), children: (0, jsx_runtime_1.jsx)(CloseIcon, {}) }))] }));
    const body = (0, jsx_runtime_1.jsx)("div", { className: "cg-dialog__body", children: children });
    const foot = footer && (0, jsx_runtime_1.jsx)("div", { className: "cg-dialog__foot", children: footer });
    if (!asPanel) {
        return ((0, jsx_runtime_1.jsxs)(Sheet_js_1.Sheet, { open: true, onClose: onClose, inline: inline, className: (0, cx_js_1.cx)('cg-dialog cg-dialog--sheet', className), style: style, ...rest, children: [head, body, foot] }));
    }
    const aside = ((0, jsx_runtime_1.jsxs)("aside", { ref: panel, role: "dialog", "aria-modal": !inline, tabIndex: -1, className: (0, cx_js_1.cx)('cg-dialog cg-sidepanel', inline && 'cg-sidepanel--inline', className), style: { ...style, width }, ...rest, children: [head, body, foot] }));
    if (inline)
        return aside;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "cg-dialog-layer cg-dialog-layer--side", children: [(0, jsx_runtime_1.jsx)("div", { className: "cg-sheet-backdrop", onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), "aria-hidden": "true" }), aside] }));
}
