import * as React from 'react';
export interface CheckCircleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked: boolean;
    /** Amber ring when the item is overdue and not done. */
    overdue?: boolean;
    onChange?: (checked: boolean) => void;
    /** Accessible name. */
    label?: string;
}
/** 22 px check circle with a 44 px hit area. */
export declare const CheckCircle: React.ForwardRefExoticComponent<CheckCircleProps & React.RefAttributes<HTMLButtonElement>>;
