import * as React from 'react';
export interface SegmentedOption<T extends string> {
    value: T;
    label: React.ReactNode;
}
export interface SegmentedProps<T extends string> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (value: T) => void;
    /** Stretch to the container width. */
    block?: boolean;
    /** Accessible name of the group. */
    label?: string;
}
/** Segmented control: Εβδομάδα | Μήνας. Arrow keys move the selection. */
export declare function Segmented<T extends string>({ options, value, onChange, block, label, className, ...rest }: SegmentedProps<T>): React.JSX.Element;
