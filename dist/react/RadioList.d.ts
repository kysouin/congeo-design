import * as React from 'react';
export interface RadioOption<T extends string> {
    value: T;
    label: React.ReactNode;
    description?: React.ReactNode;
    /** A trailing mark: a badge, an icon, a count. */
    mark?: React.ReactNode;
    disabled?: boolean;
}
export interface RadioListProps<T extends string> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    options: RadioOption<T>[];
    value: T | null;
    onChange: (value: T) => void;
    /** Accessible name of the group. */
    label?: string;
}
/** A vertical list of options with label, description and trailing mark. radiogroup; arrow keys move the selection. */
export declare function RadioList<T extends string>({ options, value, onChange, label, className, ...rest }: RadioListProps<T>): React.JSX.Element;
