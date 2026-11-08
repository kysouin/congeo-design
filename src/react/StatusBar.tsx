import * as React from 'react';
import { cx } from './cx';
import { L } from '../i18n/core.js';

export type StatusBarState = 'offline' | 'sending' | 'failed' | 'ok';

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  state: StatusBarState;
  /** Number of queued, failed or sent items. */
  count?: number;
  labels?: Partial<Record<StatusBarState, string>>;
  /**
   * Milliseconds before the bar hides itself. Default: 4000 for `ok`, never for the others.
   * Pass `false` (or `persist`) to keep it shown.
   */
  autoHide?: number | false;
  /** Keep the bar shown; same as autoHide={false}. */
  persist?: boolean;
  /** Called when the bar hid itself. */
  onHide?: () => void;
}

const defaultLabels = (): Record<StatusBarState, string> => ({
  offline: L('Offline', 'Εκτός σύνδεσης'),
  sending: L('Sending', 'Αποστολή'),
  failed: L('Not sent', 'Αποτυχία αποστολής'),
  ok: L('Sent', 'Στάλθηκαν'),
});

/** Sync status: offline, sending, failed, with a count; ok («3 changes sent») hides itself after 4 s. */
export function StatusBar({ state, count, labels, autoHide, persist, onHide, className, children, ...rest }: StatusBarProps) {
  const delay = persist || autoHide === false ? null : autoHide ?? (state === 'ok' ? 4000 : null);
  const [hidden, setHidden] = React.useState(false);
  const onHideRef = React.useRef(onHide);
  onHideRef.current = onHide;
  React.useEffect(() => {
    setHidden(false);
    if (delay == null) return;
    const t = setTimeout(() => {
      setHidden(true);
      onHideRef.current?.();
    }, delay);
    return () => clearTimeout(t);
  }, [delay, state, count, children]);
  if (hidden) return null;
  const text = children ?? { ...defaultLabels(), ...labels }[state];
  return (
    <div role="status" className={cx('cg-statusbar', `cg-statusbar--${state}`, className)} {...rest}>
      <span className="cg-statusbar__dot" aria-hidden="true" />
      <span className="cg-statusbar__text">{text}</span>
      {count != null && <span className="cg-statusbar__count">{count}</span>}
    </div>
  );
}
