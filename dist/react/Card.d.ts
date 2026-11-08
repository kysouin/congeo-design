import * as React from 'react';
import { Accent } from './types.js';
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
    size?: 'md' | 'lg';
    raised?: boolean;
    flat?: boolean;
    /** Fill with the tool/status tint. */
    tint?: Accent;
    title?: React.ReactNode;
    as?: 'div' | 'section' | 'article' | 'li';
}
export declare function Card({ size, raised, flat, tint, title, as, className, children, ...rest }: CardProps): React.JSX.Element;
