import * as React from 'react';
export interface SwipeRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /** A right drag past the threshold: «Έγινε» (ok). */
    onDone?: () => void;
    /** A left drag past the threshold: «Αύριο» (ink-2). */
    onLater?: () => void;
    /** Alias of onDone. */
    onSwipeRight?: () => void;
    /** Alias of onLater. */
    onSwipeLeft?: () => void;
    rightLabel?: React.ReactNode;
    leftLabel?: React.ReactNode;
    /** Distance in px that commits the action. Default 72. */
    threshold?: number;
    /** Haptics are not available on the web. Called when the threshold is crossed and when an action commits. */
    onHaptic?: (kind: 'arm' | 'disarm' | 'commit') => void;
    /** Show a revealed state without interaction (for documentation). */
    preview?: 'left' | 'right';
    disabled?: boolean;
}
/**
 * Horizontal swipe row. Uses pointer events, does not block vertical scroll
 * (touch-action: pan-y; a vertical move cancels the gesture), has a threshold
 * and springs back.
 */
export declare function SwipeRow({ onDone, onLater, onSwipeRight: onSwipeRightProp, onSwipeLeft: onSwipeLeftProp, rightLabel, leftLabel, threshold, onHaptic, preview, disabled, className, children, ...rest }: SwipeRowProps): React.JSX.Element;
