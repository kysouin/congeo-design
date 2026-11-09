import * as React from 'react';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Full width. */
    block?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    /** Required: the accessible name, since the button shows only an icon. Also the tooltip. */
    label: string;
    /** 44 px (touch, default) or 36 px (dense toolbars, desktop). */
    size?: 'md' | 'sm';
    /** Show the label as a tooltip on hover and focus. Default true. */
    tooltip?: boolean;
}
/** Round icon button, 44 px (or 36 px dense). Pass a Lucide icon as the child. */
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
