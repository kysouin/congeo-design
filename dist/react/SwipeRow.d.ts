import * as React from 'react';
export interface SwipeRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Swipe right reveals this (ok, «Έγινε»). */
    onSwipeRight?: () => void;
    /** Swipe left reveals this (ink-2, «Αύριο»). */
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
export declare function SwipeRow({ onSwipeRight, onSwipeLeft, rightLabel, leftLabel, threshold, onHaptic, preview, disabled, className, children, ...rest }: SwipeRowProps): React.JSX.Element;
