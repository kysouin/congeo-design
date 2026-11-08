import * as React from 'react';
export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    open: boolean;
    onClose?: () => void;
    title?: React.ReactNode;
    /** Footer actions: secondary first (left), primary last (right). */
    footer?: React.ReactNode;
    /** Modal width from 900 px up. Default 560. */
    maxWidth?: number;
    /** Force one container (documentation, tests). Default: by the screen width. */
    variant?: 'auto' | 'modal' | 'sheet';
    /** Render in flow, open, without a backdrop (documentation). */
    inline?: boolean;
    closeButton?: boolean;
}
/**
 * The right container per screen: a bottom Sheet on a phone, a centred modal from 900 px up. Title, body,
 * footer actions (secondary left, primary right), Escape, backdrop, focus trap and return, on both.
 *
 * Use Dialog for a decision or a short form that interrupts; use SidePanel to edit one item while the list
 * stays in view (calendar's editor).
 */
export declare function Dialog({ open, onClose, title, footer, maxWidth, variant, inline, closeButton, className, children, style, ...rest }: DialogProps): React.JSX.Element | null;
export interface SidePanelProps extends Omit<DialogProps, 'maxWidth' | 'variant'> {
    /** Panel width from 900 px up. Default 420. */
    width?: number;
    variant?: 'auto' | 'panel' | 'sheet';
}
/**
 * A bottom Sheet on a phone, a right-hand side panel from 900 px up: for editing one item while the rest of
 * the screen stays in view. Same head, body and footer as Dialog.
 */
export declare function SidePanel({ open, onClose, title, footer, width, variant, inline, closeButton, className, children, style, ...rest }: SidePanelProps): React.JSX.Element | null;
