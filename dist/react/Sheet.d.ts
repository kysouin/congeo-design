import * as React from 'react';
export interface SheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    open: boolean;
    onClose?: () => void;
    title?: React.ReactNode;
    /** Show a close button in the head. */
    closeButton?: boolean;
    /** Render in flow instead of fixed to the bottom (for documentation). */
    inline?: boolean;
    /** Fraction of the sheet's height a drag must cover to close it. Default 0.25. */
    threshold?: number;
    /** Extra content in the head, right of the title. */
    headExtra?: React.ReactNode;
}
/**
 * Bottom sheet with a grabber. Closes on Escape, on the backdrop, and on a drag down (on the grabber or the
 * head) past 25 % of its height or a fast flick; otherwise it springs back. Focus is trapped inside while
 * open and returns to the opener on close. The spring honours prefers-reduced-motion through the tokens.
 */
export declare function Sheet({ open, onClose, title, closeButton, inline, threshold, headExtra, className, children, style, ...rest }: SheetProps): React.JSX.Element | null;
