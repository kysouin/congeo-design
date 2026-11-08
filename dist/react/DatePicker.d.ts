import * as React from 'react';
export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** YYYY-MM-DD or ''. */
    value: string;
    onPick: (day: string) => void;
    /** Today, YYYY-MM-DD (defaults to Nicosia today; tests pass a fixed one). */
    today?: string;
}
/** A Monday-first month grid with year and month steps. Generalised from calendar's DatePicker. */
export declare function DatePicker({ value, onPick, today: todayProp, className, ...rest }: DatePickerProps): React.JSX.Element;
