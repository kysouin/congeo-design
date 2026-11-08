import * as React from 'react';
export interface FieldProps {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
}
/** The label / hint / error chrome around a control. The control must carry `id`. */
export declare function Field({ label, hint, error, id, children }: FieldProps & {
    id: string;
    children: React.ReactNode;
}): React.JSX.Element;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, FieldProps {
    mono?: boolean;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {
    /** Maximum rows before it scrolls. */
    maxRows?: number;
    /** When set, Enter submits instead of adding a line (Shift+Enter still adds one). */
    onSubmit?: () => void;
}
/** Textarea that grows with its text. */
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
