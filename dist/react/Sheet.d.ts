import * as React from 'react';
export interface SheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    open: boolean;
    onClose?: () => void;
    title?: React.ReactNode;
    /** Render in flow instead of fixed to the bottom (for documentation). */
    inline?: boolean;
}
/** Bottom sheet with a grabber. Escape and the backdrop close it. */
export declare function Sheet({ open, onClose, title, inline, className, children, ...rest }: SheetProps): React.JSX.Element | null;
