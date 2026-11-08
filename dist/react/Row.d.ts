import * as React from 'react';
import { Accent } from './types.js';
export interface RowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Wraps; never scrolls sideways. */
    title: React.ReactNode;
    /** Meta line under the title (chips, times, tool marks). */
    meta?: React.ReactNode;
    /** Left accent bar in a tool or status colour. */
    accent?: Accent;
    /** Shows the amber pending mark in the trailing slot. */
    pending?: boolean;
    /** Strikes the title. */
    done?: boolean;
    /** Leading slot (e.g. a CheckCircle). */
    lead?: React.ReactNode;
    /** Trailing slot (e.g. a chevron icon or a time). */
    trail?: React.ReactNode;
    as?: 'div' | 'li' | 'a' | 'button';
    href?: string;
}
export declare function Row({ title, meta, accent, pending, done, lead, trail, as, href, className, children, ...rest }: RowProps): React.JSX.Element;
