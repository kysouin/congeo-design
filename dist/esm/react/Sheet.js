import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { IconButton } from './Button.js';
import { L } from '../i18n/core.js';
import { useModalFocus } from './focus.js';
const FLICK = 0.6; // px per ms
/**
 * Bottom sheet with a grabber. Closes on Escape, on the backdrop, and on a drag down (on the grabber or the
 * head) past 25 % of its height or a fast flick; otherwise it springs back. Focus is trapped inside while
 * open and returns to the opener on close. The spring honours prefers-reduced-motion through the tokens.
 */
export function Sheet({ open, onClose, title, closeButton, inline, threshold = 0.25, headExtra, className, children, style, ...rest }) {
    const panel = React.useRef(null);
    const [dy, setDy] = React.useState(0);
    const [dragging, setDragging] = React.useState(false);
    const drag = React.useRef(null);
    const onCloseRef = React.useRef(onClose);
    onCloseRef.current = onClose;
    useModalFocus(open && !inline, panel, onClose);
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
    const content = (_jsxs("div", { ref: panel, role: "dialog", "aria-modal": !inline, tabIndex: -1, className: cx('cg-sheet', inline && 'cg-sheet--inline', dragging && 'cg-sheet--dragging', className), style: { ...style, transform: dy ? `translateY(${dy}px)` : undefined }, onPointerDown: start, onPointerMove: move, onPointerUp: end, onPointerCancel: end, ...rest, children: [_jsx("div", { className: "cg-sheet__grabber", "aria-hidden": "true" }), (title != null || closeButton || headExtra) && (_jsxs("div", { className: "cg-sheet__head", children: [title != null && _jsx("h2", { className: "cg-sheet__title", children: title }), headExtra, closeButton && (_jsx(IconButton, { variant: "ghost", label: L('Close', 'Κλείσιμο'), onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), children: _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M18 6 6 18M6 6l12 12" }) }) }))] })), children] }));
    if (inline)
        return content;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "cg-sheet-backdrop", onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), "aria-hidden": "true" }), content] }));
}
