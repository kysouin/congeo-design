import * as React from 'react';
import { cx } from './cx.js';
import { Accent, accentAttrs } from './types.js';

export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  /** Colour of the dot. Omit for no dot. */
  dot?: Accent;
  count?: number;
}

/** Filter pill with a dot and a count. Toggle via aria-pressed. */
export const FilterPill = React.forwardRef<HTMLButtonElement, FilterPillProps>(function FilterPill(
  { active, dot, count, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} aria-pressed={!!active} className={cx('cg-pill', className)} {...accentAttrs(dot)} {...rest}>
      {dot && <span className="cg-pill__dot" aria-hidden="true" />}
      <span className="cg-pill__label">{children}</span>
      {count != null && <span className="cg-pill__count">{count}</span>}
    </button>
  );
});

export function FilterPills({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('cg-pills', className)} {...rest} />;
}
