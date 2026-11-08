import * as React from 'react';
import { cx } from './cx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'text' | 'title' | 'circle' | 'row' | 'card';
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ variant = 'text', width, height, className, style, ...rest }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx('cg-skeleton', `cg-skeleton--${variant}`, className)}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
