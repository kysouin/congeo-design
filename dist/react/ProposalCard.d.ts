import * as React from 'react';
export interface ProposalCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: React.ReactNode;
    body?: React.ReactNode;
    onApprove?: () => void;
    onReject?: () => void;
    approveLabel?: string;
    rejectLabel?: string;
    label?: string;
    busy?: boolean;
}
/** Purple dashed card with the label «ΠΡΟΤΑΣΗ» and approve/reject buttons. */
export declare function ProposalCard({ title, body, onApprove, onReject, approveLabel, rejectLabel, label, busy, className, children, ...rest }: ProposalCardProps): React.JSX.Element;
