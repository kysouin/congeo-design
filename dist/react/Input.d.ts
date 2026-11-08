import * as React from 'react';
export interface FieldProps {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
}
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, FieldProps {
    mono?: boolean;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {
    /** Maximum rows before it scrolls. */
    maxRows?: number;
}
/** Textarea that grows with its text. */
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
