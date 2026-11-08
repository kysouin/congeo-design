import * as React from 'react';
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
/** Sync status: offline, sending, failed, with a count; ok («3 changes sent») hides itself after 4 s. */
export declare function StatusBar({ state, count, labels, autoHide, persist, onHide, className, children, ...rest }: StatusBarProps): React.JSX.Element | null;
