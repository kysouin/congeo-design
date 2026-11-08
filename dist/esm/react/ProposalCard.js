import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
import { Button } from './Button.js';
import { L } from '../i18n/core.js';
/** Purple dashed card with the label «ΠΡΟΤΑΣΗ» and approve/reject buttons. */
export function ProposalCard({ title, body, onApprove, onReject, approveLabel, rejectLabel, label, busy, className, children, ...rest }) {
    return (_jsxs("div", { className: cx('cg-proposal', className), "data-status": "proposal", ...rest, children: [_jsx("div", { className: "cg-cap cg-proposal__label", children: label !== null && label !== void 0 ? label : L('Proposal', 'Πρόταση') }), _jsx("h3", { className: "cg-proposal__title", children: title }), body != null && _jsx("p", { className: "cg-proposal__body", children: body }), children, (onApprove || onReject) && (_jsxs("div", { className: "cg-proposal__actions", children: [onReject && (_jsx(Button, { variant: "secondary", onClick: onReject, disabled: busy, children: rejectLabel !== null && rejectLabel !== void 0 ? rejectLabel : L('Reject', 'Απόρριψη') })), onApprove && (_jsx(Button, { variant: "primary", onClick: onApprove, disabled: busy, children: approveLabel !== null && approveLabel !== void 0 ? approveLabel : L('Approve', 'Έγκριση') }))] }))] }));
}
