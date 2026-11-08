import * as React from 'react';
import { cx } from './cx';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** A Lucide icon element, size 24. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  text?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, text, action, className, ...rest }: EmptyStateProps) {
  return (
    <div className={cx('cg-empty', className)} {...rest}>
      {icon && <div className="cg-empty__icon">{icon}</div>}
      <h3 className="cg-empty__title">{title}</h3>
      {text != null && <p className="cg-empty__text">{text}</p>}
      {action && <div className="cg-empty__action">{action}</div>}
    </div>
  );
}
