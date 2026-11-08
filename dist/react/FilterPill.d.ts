import * as React from 'react';
import { Accent } from './types.js';
export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    /** Colour of the dot. Omit for no dot. */
    dot?: Accent;
    count?: number;
}
/** Filter pill with a dot and a count. Toggle via aria-pressed. */
export declare const FilterPill: React.ForwardRefExoticComponent<FilterPillProps & React.RefAttributes<HTMLButtonElement>>;
export declare function FilterPills({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
