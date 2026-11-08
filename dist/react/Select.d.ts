import * as React from 'react';
import { type FieldProps } from './Input';
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, FieldProps {
}
/**
 * A native <select> in the Input chrome with a Lucide chevron. It never becomes a custom listbox, so the
 * iPhone keeps its native wheel. Pass <option> children.
 */
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
