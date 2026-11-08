import * as React from 'react';
import { cx } from './cx';
import { Button } from './Button';

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
  approveLabel = 'Έγκριση',
  rejectLabel = 'Απόρριψη',
  label = 'Πρόταση',
  busy,
  className,
  children,
  ...rest
}: ProposalCardProps) {
  return (
    <div className={cx('cg-proposal', className)} data-status="proposal" {...rest}>
      <div className="cg-cap cg-proposal__label">{label}</div>
      <h3 className="cg-proposal__title">{title}</h3>
      {body != null && <p className="cg-proposal__body">{body}</p>}
      {children}
      {(onApprove || onReject) && (
        <div className="cg-proposal__actions">
          {onApprove && (
            <Button variant="primary" onClick={onApprove} disabled={busy}>
              {approveLabel}
            </Button>
          )}
          {onReject && (
            <Button variant="secondary" onClick={onReject} disabled={busy}>
              {rejectLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
