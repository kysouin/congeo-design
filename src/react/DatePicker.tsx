import * as React from 'react';
import { cx } from './cx';
import { IconButton } from './Button';
import { L } from '../i18n/core.js';
import { addMonths, dayHeads, dayOf, monthGrid, monthOf, monthTitle } from '../i18n/dates.js';

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** YYYY-MM-DD or ''. */
  value: string;
  onPick: (day: string) => void;
  /** Today, YYYY-MM-DD (defaults to Nicosia today; tests pass a fixed one). */
  today?: string;
}

const Chevron = ({ dir }: { dir: 'l' | 'r' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'l' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
);

/** A Monday-first month grid with year and month steps. Generalised from calendar's DatePicker. */
export function DatePicker({ value, onPick, today: todayProp, className, ...rest }: DatePickerProps) {
  const today = todayProp ?? dayOf();
  const [month, setMonth] = React.useState(monthOf(value || today));
  React.useEffect(() => {
    if (value) setMonth(monthOf(value));
  }, [value]);
  const year = month.slice(0, 4);
  const cells = monthGrid(month);
  const heads = dayHeads();
  return (
    <div className={cx('cg-datepicker', className)} {...rest}>
      <div className="cg-datepicker__steps">
        <div className="cg-datepicker__step" role="group" aria-label={L('Year', 'Έτος')}>
          <IconButton variant="ghost" label={L('Previous year', 'Προηγούμενο έτος')} onClick={() => setMonth(addMonths(month, -12))}>
            <Chevron dir="l" />
          </IconButton>
          <span className="cg-datepicker__label cg-mono">{year}</span>
          <IconButton variant="ghost" label={L('Next year', 'Επόμενο έτος')} onClick={() => setMonth(addMonths(month, 12))}>
            <Chevron dir="r" />
          </IconButton>
        </div>
        <div className="cg-datepicker__step" role="group" aria-label={L('Month', 'Μήνας')}>
          <IconButton variant="ghost" label={L('Previous month', 'Προηγούμενος μήνας')} onClick={() => setMonth(addMonths(month, -1))}>
            <Chevron dir="l" />
          </IconButton>
          <span className="cg-datepicker__label">{monthTitle(month)}</span>
          <IconButton variant="ghost" label={L('Next month', 'Επόμενος μήνας')} onClick={() => setMonth(addMonths(month, 1))}>
            <Chevron dir="r" />
          </IconButton>
        </div>
      </div>
      <div className="cg-datepicker__grid" role="grid" aria-label={monthTitle(month)}>
        {heads.map((h) => (
          <div key={h} className="cg-datepicker__head" role="columnheader">
            {h}
          </div>
        ))}
        {cells.map((d) => (
          <button
            key={d}
            type="button"
            role="gridcell"
            aria-selected={d === value || undefined}
            aria-current={d === today ? 'date' : undefined}
            aria-label={d}
            className={cx('cg-datepicker__cell', monthOf(d) !== month && 'cg-datepicker__cell--faded', d === today && 'cg-datepicker__cell--today', d === value && 'cg-datepicker__cell--selected')}
            onClick={() => onPick(d)}
          >
            <span className="cg-datepicker__num">{+d.slice(8, 10)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
