import * as React from 'react';
import { cx } from './cx';
import { Button } from './Button';
import { L } from '../i18n/core.js';

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
export function ProposalCard({
  title,
  body,
  onApprove,
  onReject,
  approveLabel,
  rejectLabel,
  label,
  busy,
  className,
  children,
  ...rest
}: ProposalCardProps) {
  return (
    <div className={cx('cg-proposal', className)} data-status="proposal" {...rest}>
      <div className="cg-cap cg-proposal__label">{label ?? L('Proposal', 'Πρόταση')}</div>
      <h3 className="cg-proposal__title">{title}</h3>
      {body != null && <p className="cg-proposal__body">{body}</p>}
      {children}
      {(onApprove || onReject) && (
        <div className="cg-proposal__actions">
          {/* Reject first as secondary; Approve last as primary, on the side the thumb reaches (Proposal mockup) */}
          {onReject && (
            <Button variant="secondary" onClick={onReject} disabled={busy}>
              {rejectLabel ?? L('Reject', 'Απόρριψη')}
            </Button>
          )}
          {onApprove && (
            <Button variant="primary" onClick={onApprove} disabled={busy}>
              {approveLabel ?? L('Approve', 'Έγκριση')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
