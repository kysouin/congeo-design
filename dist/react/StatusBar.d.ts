import * as React from 'react';
export type StatusBarState = 'offline' | 'sending' | 'failed';
export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
    state: StatusBarState;
    /** Number of queued or failed items. */
    count?: number;
    labels?: Partial<Record<StatusBarState, string>>;
}
/** Sync status: offline, sending, failed, with a count. */
export declare function StatusBar({ state, count, labels, className, children, ...rest }: StatusBarProps): React.JSX.Element;
