import * as React from 'react';
import { cx } from './cx';
import { L } from '../i18n/core.js';

export type StatusBarState = 'offline' | 'sending' | 'failed';

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  state: StatusBarState;
  /** Number of queued or failed items. */
  count?: number;
  labels?: Partial<Record<StatusBarState, string>>;
}

const defaultLabels = (): Record<StatusBarState, string> => ({
  offline: L('Offline', 'Εκτός σύνδεσης'),
  sending: L('Sending', 'Αποστολή'),
  failed: L('Not sent', 'Αποτυχία αποστολής'),
});

/** Sync status: offline, sending, failed, with a count. */
export function StatusBar({ state, count, labels, className, children, ...rest }: StatusBarProps) {
  const text = children ?? { ...defaultLabels(), ...labels }[state];
  return (
    <div role="status" className={cx('cg-statusbar', `cg-statusbar--${state}`, className)} {...rest}>
      <span className="cg-statusbar__dot" aria-hidden="true" />
      <span className="cg-statusbar__text">{text}</span>
      {count != null && <span className="cg-statusbar__count">{count}</span>}
    </div>
  );
}
