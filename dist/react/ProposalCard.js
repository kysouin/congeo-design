"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalCard = ProposalCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const cx_1 = require("./cx");
const Button_1 = require("./Button");
/** Purple dashed card with the label «ΠΡΟΤΑΣΗ» and approve/reject buttons. */
function ProposalCard({ title, body, onApprove, onReject, approveLabel = 'Έγκριση', rejectLabel = 'Απόρριψη', label = 'Πρόταση', busy, className, children, ...rest }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, cx_1.cx)('cg-proposal', className), "data-status": "proposal", ...rest, children: [(0, jsx_runtime_1.jsx)("div", { className: "cg-cap cg-proposal__label", children: label }), (0, jsx_runtime_1.jsx)("h3", { className: "cg-proposal__title", children: title }), body != null && (0, jsx_runtime_1.jsx)("p", { className: "cg-proposal__body", children: body }), children, (onApprove || onReject) && ((0, jsx_runtime_1.jsxs)("div", { className: "cg-proposal__actions", children: [onApprove && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", onClick: onApprove, disabled: busy, children: approveLabel })), onReject && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", onClick: onReject, disabled: busy, children: rejectLabel }))] }))] }));
}
