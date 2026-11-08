import * as React from 'react';
import { cx } from './cx';

export type StatusBarState = 'offline' | 'sending' | 'failed';

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  state: StatusBarState;
  /** Number of queued or failed items. */
  count?: number;
  labels?: Partial<Record<StatusBarState, string>>;
}

const DEFAULT_LABELS: Record<StatusBarState, string> = {
  offline: 'Εκτός σύνδεσης',
  sending: 'Αποστολή',
  failed: 'Αποτυχία αποστολής',
};

/** Sync status: offline, sending, failed, with a count. */
export function StatusBar({ state, count, labels, className, children, ...rest }: StatusBarProps) {
  const text = children ?? { ...DEFAULT_LABELS, ...labels }[state];
  return (
    <div role="status" className={cx('cg-statusbar', `cg-statusbar--${state}`, className)} {...rest}>
      <span className="cg-statusbar__dot" aria-hidden="true" />
      <span className="cg-statusbar__text">{text}</span>
      {count != null && <span className="cg-statusbar__count">{count}</span>}
    </div>
  );
}
