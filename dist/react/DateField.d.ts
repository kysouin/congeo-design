import * as React from 'react';
import { type FieldProps } from './Input';
export interface DateFieldProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    /** YYYY-MM-DD or ''. */
    value: string;
    onChange: (iso: string) => void;
    /** Show ‹ › Today quick steps beside the input. */
    steps?: boolean;
    /** Today, YYYY-MM-DD (defaults to Nicosia today). */
    today?: string;
}
/**
 * A date typed as ΗΗ/ΜΜ/ΕΕΕΕ whatever the device locale, with a Monday-first picker. The value is ISO.
 * Generalised from calendar's DateField.
 */
export declare const DateField: React.ForwardRefExoticComponent<DateFieldProps & React.RefAttributes<HTMLInputElement>>;
export interface TimeFieldProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    /** HH:mm or ''. */
    value: string;
    onChange: (hhmm: string) => void;
    /** Minutes between the picker's options. Default 5. */
    step?: number;
}
/** A 24-hour time typed as ΩΩ:ΛΛ whatever the device locale, with a 5-minute list. The value is HH:mm. */
export declare const TimeField: React.ForwardRefExoticComponent<TimeFieldProps & React.RefAttributes<HTMLInputElement>>;
