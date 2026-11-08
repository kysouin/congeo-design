import * as React from 'react';
export type ToastKind = 'info' | 'ok' | 'warn' | 'err';
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
    kind?: ToastKind;
    action?: {
        label: string;
        onClick: () => void;
    };
}
/** One toast. Place inside <ToastRegion>. */
export declare function Toast({ kind, action, className, children, ...rest }: ToastProps): React.JSX.Element;
export interface ToastRegionProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Render in flow instead of fixed to the top (for documentation). */
    inline?: boolean;
}
/** Fixed at the top, under the safe area. It never covers inputs: the keyboard and the inputs live at the bottom. */
export declare function ToastRegion({ inline, className, ...rest }: ToastRegionProps): React.JSX.Element;
