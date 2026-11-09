import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { IconButton } from './Button.js';
import { Sheet } from './Sheet.js';
import { L } from '../i18n/core.js';
import { DESKTOP_QUERY, useMediaQuery, useModalFocus } from './focus.js';
const CloseIcon = () => (_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M18 6 6 18M6 6l12 12" }) }));
/**
 * The right container per screen: a bottom Sheet on a phone, a centred modal from 900 px up. Title, body,
 * footer actions (secondary left, primary right), Escape, backdrop, focus trap and return, on both.
 *
 * Use Dialog for a decision or a short form that interrupts; use SidePanel to edit one item while the list
 * stays in view (calendar's editor).
 */
export function Dialog({ open, onClose, title, footer, maxWidth = 560, variant = 'auto', inline, closeButton = true, className, children, style, ...rest }) {
    const desktop = useMediaQuery(DESKTOP_QUERY, false);
    const asModal = variant === 'modal' || (variant === 'auto' && desktop);
    const panel = React.useRef(null);
    useModalFocus(open && asModal && !inline, panel, onClose);
    if (!open)
        return null;
    const head = (title != null || closeButton) && (_jsxs("div", { className: "cg-dialog__head", children: [title != null && _jsx("h2", { className: "cg-dialog__title", children: title }), closeButton && (_jsx(IconButton, { variant: "ghost", size: "sm", label: L('Close', 'Κλείσιμο'), onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), children: _jsx(CloseIcon, {}) }))] }));
    const body = _jsx("div", { className: "cg-dialog__body", children: children });
    const foot = footer && _jsx("div", { className: "cg-dialog__foot", children: footer });
    if (!asModal) {
        return (_jsxs(Sheet, { open: true, onClose: onClose, inline: inline, className: cx('cg-dialog cg-dialog--sheet', className), style: style, ...rest, children: [head, body, foot] }));
    }
    const modal = (_jsxs("div", { ref: panel, role: "dialog", "aria-modal": !inline, tabIndex: -1, className: cx('cg-dialog cg-dialog--modal', inline && 'cg-dialog--inline', className), style: { ...style, maxWidth }, ...rest, children: [head, body, foot] }));
    if (inline)
        return modal;
    return (_jsxs("div", { className: "cg-dialog-layer", children: [_jsx("div", { className: "cg-sheet-backdrop", onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), "aria-hidden": "true" }), modal] }));
}
/**
 * A bottom Sheet on a phone, a right-hand side panel from 900 px up: for editing one item while the rest of
 * the screen stays in view. Same head, body and footer as Dialog.
 */
export function SidePanel({ open, onClose, title, footer, width = 420, variant = 'auto', inline, closeButton = true, className, children, style, ...rest }) {
    const desktop = useMediaQuery(DESKTOP_QUERY, false);
    const asPanel = variant === 'panel' || (variant === 'auto' && desktop);
    const panel = React.useRef(null);
    useModalFocus(open && asPanel && !inline, panel, onClose);
    if (!open)
        return null;
    const head = (title != null || closeButton) && (_jsxs("div", { className: "cg-dialog__head", children: [title != null && _jsx("h2", { className: "cg-dialog__title", children: title }), closeButton && (_jsx(IconButton, { variant: "ghost", size: "sm", label: L('Close', 'Κλείσιμο'), onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), children: _jsx(CloseIcon, {}) }))] }));
    const body = _jsx("div", { className: "cg-dialog__body", children: children });
    const foot = footer && _jsx("div", { className: "cg-dialog__foot", children: footer });
    if (!asPanel) {
        return (_jsxs(Sheet, { open: true, onClose: onClose, inline: inline, className: cx('cg-dialog cg-dialog--sheet', className), style: style, ...rest, children: [head, body, foot] }));
    }
    const aside = (_jsxs("aside", { ref: panel, role: "dialog", "aria-modal": !inline, tabIndex: -1, className: cx('cg-dialog cg-sidepanel', inline && 'cg-sidepanel--inline', className), style: { ...style, width }, ...rest, children: [head, body, foot] }));
    if (inline)
        return aside;
    return (_jsxs("div", { className: "cg-dialog-layer cg-dialog-layer--side", children: [_jsx("div", { className: "cg-sheet-backdrop", onClick: () => onClose === null || onClose === void 0 ? void 0 : onClose(), "aria-hidden": "true" }), aside] }));
}
