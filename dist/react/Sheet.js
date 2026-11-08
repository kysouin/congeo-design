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
const cx_js_1 = require("./cx.js");
const Button_js_1 = require("./Button.js");
const core_js_1 = require("../i18n/core.js");
const focus_js_1 = require("./focus.js");
const FLICK = 0.6; // px per ms
/**
 * Bottom sheet with a grabber. Closes on Escape, on the backdrop, and on a drag down (on the grabber or the
 * head) past 25 % of its height or a fast flick; otherwise it springs back. Focus is trapped inside while
 * open and returns to the opener on close. The spring honours prefers-reduced-motion through the tokens.
 */
function Sheet({ open, onClose, title, closeButton, inline, threshold = 0.25, headExtra, className, children, style, ...rest }) {
    const panel = React.useRef(null);
    const [dy, setDy] = React.useState(0);
    const [dragging, setDragging] = React.useState(false);
    const drag = React.useRef(null);
    const onCloseRef = React.useRef(onClose);
    onCloseRef.current = onClose;
    (0, focus_js_1.useModalFocus)(open && !inline, panel, onClose);
    if (!open)
        return null;
    const start = (e) => {
        if (inline)
            return;
        const t = e.target;
        if (!t.closest('.cg-sheet__grabber, .cg-sheet__head') || t.closest('button, a, input, select, textarea'))
            return;
        if (e.pointerType === 'mouse' && e.button !== 0)
            return;
        drag.current = { id: e.pointerId, y0: e.clientY, t0: e.timeStamp, yPrev: e.clientY, tPrev: e.timeStamp, v: 0 };
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId)
            return;
        const dt = e.timeStamp - d.tPrev;
        if (dt > 0)
            d.v = (e.clientY - d.yPrev) / dt;
        d.yPrev = e.clientY;
        d.tPrev = e.timeStamp;
        setDy(Math.max(0, e.clientY - d.y0));
    };
    const end = (e) => {
        var _a, _b;
        var _c;
        const d = drag.current;
        if (!d || d.id !== e.pointerId)
            return;
        drag.current = null;
        const dist = e.clientY - d.y0;
        const h = (_c = (_a = panel.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().height) !== null && _c !== void 0 ? _c : 0;
        setDragging(false);
        setDy(0);
        if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
        if (e.type !== 'pointercancel' && (dist > h * threshold || (d.v > FLICK && dist > 24)))
            (_b = onCloseRef.current) === null || _b === void 0 ? void 0 : _b.call(onCloseRef);
    };
    const content = ((0, jsx_runtime_1.jsxs)("div", { ref: panel, role: "dialog", "aria-modal": !inline, tabIndex: -1, className: (0, cx_js_1.cx)('cg-sheet', inline && 'cg-sheet--inline', dragging && 'cg-sheet--dragging', className), style: { ...style, transform: dy ? `translateY(${dy}px)` : undefined }, onPointerDown: start, onPointerMove: move, onPointerUp: end, onPointerCancel: end, ...rest, children: [(0, jsx_runtime_1.jsx)("div", { className: "cg-sheet__grabber", "aria-hidden": "true" }), (title != null || closeButton || headExtra) && ((0, jsx_runtime_1.jsxs)("div", { className: "cg-sheet__head", children: [title != null && (0, jsx_runtime_1.jsx)("h2", { className: "cg-sheet__title", children: title }), headExtra, closeButton && ((0, jsx_runtime_1.jsx)(Button_js_1.IconButton, { variant: "ghost", label: (0, core_js_1.L)('Close', 'Κλείσιμο'), onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("path", { d: "M18 6 6 18M6 6l12 12" }) }) }))] })), children] }));
    if (inline)
        return content;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "cg-sheet-backdrop", onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), "aria-hidden": "true" }), content] }));
}
