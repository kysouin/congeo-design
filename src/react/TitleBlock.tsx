import * as React from 'react';
import { cx } from './cx.js';
import { L } from '../i18n/core.js';

export interface TitleBlockCell {
  label: React.ReactNode;
  value: React.ReactNode;
  /** JetBrains Mono (numbers, codes). */
  mono?: boolean;
  /** Larger value (the project number). */
  large?: boolean;
  /** Spans the full width on the phone (the name). */
  wide?: boolean;
  /** Tool / status colour for the value. */
  className?: string;
}

export interface TitleBlockProps extends React.HTMLAttributes<HTMLElement> {
  /** Project number, mono. Always the first cell, full-width on the phone. */
  number: string | number;
  /** Project name. */
  name?: React.ReactNode;
  /** Formatted date. */
  date?: React.ReactNode;
  /** Sheet number, e.g. "A-01" or "3/12". */
  sheet?: React.ReactNode;
  labels?: { number?: React.ReactNode; name?: React.ReactNode; date?: React.ReactNode; sheet?: React.ReactNode };
  /** Extra cells after the standard ones, e.g. «NEXT» («ΕΠΟΜΕΝΟ»). 4 to 6 cells in all. */
  extra?: TitleBlockCell[];
  /** Full control: the cells after the number cell, instead of name / date / sheet / extra. */
  cells?: TitleBlockCell[];
}

/**
 * The drawing title-block header, like the corner of a drawing. Desktop: one row. Phone: two columns, with
 * the project number first and full-width. 4 to 6 cells.
 */
export function TitleBlock({ number, name, date, sheet, labels, extra, cells: cellsProp, className, style, ...rest }: TitleBlockProps) {
  const l = { number: L('Project', 'Έργο'), name: L('Title', 'Τίτλος'), date: L('Date', 'Ημερομηνία'), sheet: L('Sheet', 'Φύλλο'), ...labels };
  const cells: TitleBlockCell[] =
    cellsProp ??
    ([
      name != null && { label: l.name, value: name, wide: true },
      date != null && { label: l.date, value: date, mono: true },
      sheet != null && { label: l.sheet, value: sheet, mono: true },
      ...(extra ?? []),
    ].filter(Boolean) as TitleBlockCell[]);
  const all: TitleBlockCell[] = [{ label: l.number, value: String(number), mono: true, large: true, className: 'cg-titleblock__cell--number' }, ...cells];
  return (
    <header className={cx('cg-titleblock', className)} style={{ ...style, ['--cg-tb-cols' as any]: all.length }} data-cells={all.length} {...rest}>
      {all.map((c, i) => (
        <div key={i} className={cx('cg-titleblock__cell', c.wide && 'cg-titleblock__cell--wide', c.className)}>
          <span className="cg-cap cg-titleblock__label">{c.label}</span>
          <span className={cx('cg-titleblock__value', c.mono && 'cg-titleblock__value--mono', c.large && 'cg-titleblock__value--lg')}>{c.value}</span>
        </div>
      ))}
    </header>
  );
}
