import * as React from 'react';
export interface TitleBlockCell {
    label: React.ReactNode;
    value: React.ReactNode;
    /** JetBrains Mono (numbers, codes). */
    mono?: boolean;
    /** Larger value (the project number). */
    large?: boolean;
    /** Spans the full width on the phone (the name). */
    wide?: boolean;
    /** Tool / status colour for the value. */
    className?: string;
}
export interface TitleBlockProps extends React.HTMLAttributes<HTMLElement> {
    /** Project number, mono. Always the first cell, full-width on the phone. */
    number: string | number;
    /** Project name. */
    name?: React.ReactNode;
    /** Formatted date. */
    date?: React.ReactNode;
    /** Sheet number, e.g. "A-01" or "3/12". */
    sheet?: React.ReactNode;
    labels?: {
        number?: React.ReactNode;
        name?: React.ReactNode;
        date?: React.ReactNode;
        sheet?: React.ReactNode;
    };
    /** Extra cells after the standard ones, e.g. «NEXT» («ΕΠΟΜΕΝΟ»). 4 to 6 cells in all. */
    extra?: TitleBlockCell[];
    /** Full control: the cells after the number cell, instead of name / date / sheet / extra. */
    cells?: TitleBlockCell[];
}
/**
 * The drawing title-block header, like the corner of a drawing. Desktop: one row. Phone: two columns, with
 * the project number first and full-width. 4 to 6 cells.
 */
export declare function TitleBlock({ number, name, date, sheet, labels, extra, cells: cellsProp, className, style, ...rest }: TitleBlockProps): React.JSX.Element;
