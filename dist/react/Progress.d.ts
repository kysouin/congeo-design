import * as React from 'react';
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Current value. Omit for an indeterminate bar. */
    value?: number;
    max?: number;
    /** Accessible name, e.g. «Creating PDF». Required. */
    label: string;
    /** Show the «3 of 7» text. Default true when determinate. */
    showText?: boolean;
    /** Replace the «3 of 7» text. */
    text?: React.ReactNode;
    size?: 'sm' | 'md';
}
/** «3 of 7» · «3 από 7» */
export declare function progressText(value: number, max: number): string;
/** A determinate bar (value / max) or an indeterminate one. Respects prefers-reduced-motion through the tokens. */
export declare function Progress({ value, max, label, showText, text, size, className, ...rest }: ProgressProps): React.JSX.Element;
