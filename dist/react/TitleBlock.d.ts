import * as React from 'react';
export interface TitleBlockProps extends React.HTMLAttributes<HTMLElement> {
    /** Project number, mono. */
    number: string | number;
    /** Project name. */
    name: React.ReactNode;
    /** Formatted date. */
    date: React.ReactNode;
    /** Sheet number, e.g. "A-01" or "3/12". */
    sheet: React.ReactNode;
    labels?: {
        number?: string;
        name?: string;
        date?: string;
        sheet?: string;
    };
}
/** The drawing title-block header: like the corner of a drawing. */
export declare function TitleBlock({ number, name, date, sheet, labels, className, ...rest }: TitleBlockProps): React.JSX.Element;
