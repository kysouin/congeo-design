import * as React from 'react';
export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: React.ReactNode;
    description?: React.ReactNode;
}
/** An on/off control with label and description. role="switch", 44 px target, Space and Enter toggle. */
export declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLButtonElement>>;
