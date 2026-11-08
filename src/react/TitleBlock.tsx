import * as React from 'react';
import { cx } from './cx';

export interface TitleBlockProps extends React.HTMLAttributes<HTMLElement> {
  /** Project number, mono. */
  number: string | number;
  /** Project name. */
  name: React.ReactNode;
  /** Formatted date. */
  date: React.ReactNode;
  /** Sheet number, e.g. "A-01" or "3/12". */
  sheet: React.ReactNode;
  labels?: { number?: string; name?: string; date?: string; sheet?: string };
}

const DEFAULT_LABELS = { number: 'Έργο', name: 'Τίτλος', date: 'Ημερομηνία', sheet: 'Φύλλο' };

/** The drawing title-block header: like the corner of a drawing. */
export function TitleBlock({ number, name, date, sheet, labels, className, ...rest }: TitleBlockProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  return (
    <header className={cx('cg-titleblock', className)} {...rest}>
      <div className="cg-titleblock__cell">
        <span className="cg-cap cg-titleblock__label">{l.number}</span>
        <span className="cg-titleblock__value cg-titleblock__value--mono cg-titleblock__value--lg">{String(number)}</span>
      </div>
      <div className="cg-titleblock__cell">
        <span className="cg-cap cg-titleblock__label">{l.sheet}</span>
        <span className="cg-titleblock__value cg-titleblock__value--mono">{sheet}</span>
      </div>
      <div className="cg-titleblock__cell cg-titleblock__cell--wide">
        <span className="cg-cap cg-titleblock__label">{l.name}</span>
        <span className="cg-titleblock__value">{name}</span>
      </div>
      <div className="cg-titleblock__cell cg-titleblock__cell--wide">
        <span className="cg-cap cg-titleblock__label">{l.date}</span>
        <span className="cg-titleblock__value cg-mono">{date}</span>
      </div>
    </header>
  );
}
