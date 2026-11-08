import * as React from 'react';
import { cx } from './cx';
import { Accent, accentAttrs } from './types';

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

export function Row({ title, meta, accent, pending, done, lead, trail, as, href, className, children, ...rest }: RowProps) {
  const Tag: any = as ?? (href ? 'a' : 'div');
  return (
    <Tag
      className={cx('cg-row', accent && 'cg-row--accent', done && 'cg-row--done', className)}
      href={href}
      {...accentAttrs(accent)}
      {...rest}
    >
      {accent && <span className="cg-row__accent" aria-hidden="true" />}
      <span className="cg-row__lead">{lead}</span>
      <span className="cg-row__body">
        <span className="cg-row__title">{title}</span>
        {meta != null && <span className="cg-row__meta">{meta}</span>}
        {children}
      </span>
      <span className="cg-row__trail">
        {pending && <span className="cg-row__pending" role="img" aria-label="Εκκρεμεί" />}
        {trail}
      </span>
    </Tag>
  );
}
