import * as React from 'react';
import { Accent } from './types';
export interface ProjectChipProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** The project number, e.g. "0637". */
    number: string | number;
    /** Use the tool/status tint instead of surface-2. */
    accent?: Accent;
}
/** Mono project number chip: «0637». */
export declare function ProjectChip({ number, accent, className, ...rest }: ProjectChipProps): React.JSX.Element;
