import * as React from 'react';
import { cx } from './cx';
import { Accent, accentAttrs } from './types';

export interface ProjectChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The project number, e.g. "0637". */
  number: string | number;
  /** Use the tool/status tint instead of surface-2. */
  accent?: Accent;
}

/** Mono project number chip: «0637». */
export function ProjectChip({ number, accent, className, ...rest }: ProjectChipProps) {
  return (
    <span className={cx('cg-chip', accent && 'cg-chip--tint', className)} {...accentAttrs(accent)} {...rest}>
      {String(number)}
    </span>
  );
}
