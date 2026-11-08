import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { L } from '../i18n/core.js';
const SLOP = 8; // px before we decide the gesture is horizontal
/**
 * Horizontal swipe row. Uses pointer events, does not block vertical scroll
 * (touch-action: pan-y; a vertical move cancels the gesture), has a threshold
 * and springs back.
 */
export function SwipeRow({ onDone, onLater, onSwipeRight: onSwipeRightProp, onSwipeLeft: onSwipeLeftProp, rightLabel, leftLabel, threshold = 72, onHaptic, preview, disabled, className, children, ...rest }) {
    const onSwipeRight = onDone !== null && onDone !== void 0 ? onDone : onSwipeRightProp;
    const onSwipeLeft = onLater !== null && onLater !== void 0 ? onLater : onSwipeLeftProp;
    const rootRef = React.useRef(null);
    const [x, setX] = React.useState(0);
    const [dragging, setDragging] = React.useState(false);
    const [armed, setArmed] = React.useState(false);
    const gesture = React.useRef(null);
    const armedRef = React.useRef(false);
    const setArm = (v) => {
        if (armedRef.current === v)
            return;
        armedRef.current = v;
        setArmed(v);
        onHaptic === null || onHaptic === void 0 ? void 0 : onHaptic(v ? 'arm' : 'disarm');
    };
    const onPointerDown = (e) => {
        if (disabled || preview)
            return;
        if (e.pointerType === 'mouse' && e.button !== 0)
            return;
        gesture.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, mode: 'pending' };
    };
    const onPointerMove = (e) => {
        var _a;
        const g = gesture.current;
        if (!g || g.id !== e.pointerId || g.mode === 'cancelled')
            return;
        const dx = e.clientX - g.x0;
        const dy = e.clientY - g.y0;
        if (g.mode === 'pending') {
            if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP)
                return;
            if (Math.abs(dy) > Math.abs(dx)) {
                g.mode = 'cancelled'; // vertical: leave it to the scroller
                return;
            }
            g.mode = 'h';
            (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.setPointerCapture(e.pointerId);
            setDragging(true);
        }
        const allowRight = !!onSwipeRight;
        const allowLeft = !!onSwipeLeft;
        let next = dx;
        if (next > 0 && !allowRight)
            next = 0;
        if (next < 0 && !allowLeft)
            next = 0;
        // resist beyond the threshold
        const limit = threshold * 1.6;
        if (Math.abs(next) > threshold) {
            const over = Math.abs(next) - threshold;
            next = Math.sign(next) * (threshold + over * 0.35);
        }
        next = Math.max(-limit, Math.min(limit, next));
        setX(next);
        setArm(Math.abs(dx) >= threshold);
    };
    const finish = (e) => {
        var _a;
        const g = gesture.current;
        if (!g || g.id !== e.pointerId)
            return;
        gesture.current = null;
        if (g.mode !== 'h')
            return;
        const dx = e.clientX - g.x0;
        setDragging(false);
        if ((_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.hasPointerCapture(e.pointerId))
            rootRef.current.releasePointerCapture(e.pointerId);
        if (dx >= threshold && onSwipeRight) {
            onHaptic === null || onHaptic === void 0 ? void 0 : onHaptic('commit');
            onSwipeRight();
        }
        else if (dx <= -threshold && onSwipeLeft) {
            onHaptic === null || onHaptic === void 0 ? void 0 : onHaptic('commit');
            onSwipeLeft();
        }
        setX(0); // spring back (CSS transition with the token easing)
        setArm(false);
    };
    const onPointerCancel = (e) => {
        const g = gesture.current;
        if (!g || g.id !== e.pointerId)
            return;
        gesture.current = null;
        setDragging(false);
        setX(0);
        setArm(false);
    };
    const previewX = preview === 'right' ? threshold : preview === 'left' ? -threshold : 0;
    const offset = preview ? previewX : x;
    return (_jsxs("div", { ref: rootRef, className: cx('cg-swipe', dragging && 'cg-swipe--dragging', (armed || preview) && 'cg-swipe--armed', className), style: { ['--cg-swipe-x']: `${offset}px` }, onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: finish, onPointerCancel: onPointerCancel, ...rest, children: [_jsxs("div", { className: "cg-swipe__actions", "aria-hidden": "true", children: [_jsx("div", { className: "cg-swipe__action cg-swipe__action--left", style: { opacity: offset > 0 ? 1 : 0 }, children: rightLabel !== null && rightLabel !== void 0 ? rightLabel : L('Done', 'Έγινε') }), _jsx("div", { className: "cg-swipe__action cg-swipe__action--right", style: { opacity: offset < 0 ? 1 : 0 }, children: leftLabel !== null && leftLabel !== void 0 ? leftLabel : L('Tomorrow', 'Αύριο') })] }), _jsx("div", { className: "cg-swipe__content", children: children })] }));
}
