import * as React from 'react';
export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'text' | 'title' | 'circle' | 'row' | 'card';
    width?: number | string;
    height?: number | string;
}
export declare function Skeleton({ variant, width, height, className, style, ...rest }: SkeletonProps): React.JSX.Element;
