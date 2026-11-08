import * as React from 'react';
import { cx } from './cx.js';
import { Field, type FieldProps } from './Input.js';
import { Button, IconButton } from './Button.js';
import { DatePicker } from './DatePicker.js';
import { L } from '../i18n/core.js';
import { addDays, dayOf, maskDate, maskTime, parseDate, parseTime, showDate, timeOptions } from '../i18n/dates.js';

function usePopover(onClose: () => void, open: boolean, ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, ref]);
}

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 2v4M16 2v4M3 10h18" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export interface DateFieldProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** YYYY-MM-DD or ''. */
  value: string;
  onChange: (iso: string) => void;
  /** Show ‹ › Today quick steps beside the input. */
  steps?: boolean;
  /** Today, YYYY-MM-DD (defaults to Nicosia today). */
  today?: string;
}

/**
 * A date typed as ΗΗ/ΜΜ/ΕΕΕΕ whatever the device locale, with a Monday-first picker. The value is ISO.
 * Generalised from calendar's DateField.
 */
export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(function DateField(
  { value, onChange, label, hint, error: errorProp, steps, today: todayProp, className, id: idProp, disabled, onBlur, ...rest },
  ref,
) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const [text, setText] = React.useState(showDate(value));
  const [bad, setBad] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    setText(showDate(value));
    if (value) setBad(false);
  }, [value]);
  const close = React.useCallback(() => setOpen(false), []);
  usePopover(close, open, wrap);
  const commit = (t: string) => {
    if (!t.trim()) {
      setBad(false);
      onChange('');
      return;
    }
    const iso = parseDate(t);
    setBad(!iso);
    if (iso) onChange(iso);
  };
  const today = todayProp ?? dayOf();
  const error = errorProp ?? (bad ? L('Not a valid date (DD/MM/YYYY)', 'Μη έγκυρη ημερομηνία (ΗΗ/ΜΜ/ΕΕΕΕ)') : undefined);
  return (
    <Field label={label} hint={hint} error={error} id={id}>
      <div ref={wrap} className={cx('cg-datefield', steps && 'cg-datefield--steps', className)}>
        <input
          ref={ref}
          id={id}
          className="cg-input cg-input--mono"
          inputMode="numeric"
          autoComplete="off"
          placeholder={L('DD/MM/YYYY', 'ΗΗ/ΜΜ/ΕΕΕΕ')}
          value={text}
          disabled={disabled}
          aria-invalid={error != null || undefined}
          aria-describedby={(error ?? hint) != null ? `${id}-hint` : undefined}
          onChange={(e) => {
            const t = maskDate(e.target.value);
            setText(t);
            if (t.length === 10) commit(t);
          }}
          onBlur={(e) => {
            commit(text);
            onBlur?.(e);
          }}
          {...rest}
        />
        <IconButton variant="secondary" label={L('Pick a date', 'Επιλογή ημερομηνίας')} aria-expanded={open} aria-haspopup="dialog" disabled={disabled} onClick={() => setOpen((o) => !o)}>
          <CalendarIcon />
        </IconButton>
        {steps && (
          <>
            <Button size="sm" disabled={disabled} aria-label={L('One day earlier', 'Μία ημέρα πριν')} onClick={() => onChange(addDays(value || today, -1))}>
              ‹
            </Button>
            <Button size="sm" disabled={disabled} aria-label={L('One day later', 'Μία ημέρα μετά')} onClick={() => onChange(addDays(value || today, 1))}>
              ›
            </Button>
            <Button size="sm" disabled={disabled} onClick={() => onChange(today)}>
              {L('Today', 'Σήμερα')}
            </Button>
          </>
        )}
        {open && (
          <div className="cg-popover" role="dialog" aria-label={L('Pick a date', 'Επιλογή ημερομηνίας')}>
            <DatePicker
              value={value}
              today={today}
              onPick={(d) => {
                setText(showDate(d));
                setBad(false);
                setOpen(false);
                onChange(d);
              }}
            />
          </div>
        )}
      </div>
    </Field>
  );
});

export interface TimeFieldProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** HH:mm or ''. */
  value: string;
  onChange: (hhmm: string) => void;
  /** Minutes between the picker's options. Default 5. */
  step?: number;
}

/** A 24-hour time typed as ΩΩ:ΛΛ whatever the device locale, with a 5-minute list. The value is HH:mm. */
export const TimeField = React.forwardRef<HTMLInputElement, TimeFieldProps>(function TimeField(
  { value, onChange, label, hint, error: errorProp, step = 5, className, id: idProp, disabled, onBlur, ...rest },
  ref,
) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const [text, setText] = React.useState(value);
  const [bad, setBad] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef<HTMLDivElement>(null);
  const list = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    setText(value);
    if (value) setBad(false);
  }, [value]);
  const close = React.useCallback(() => setOpen(false), []);
  usePopover(close, open, wrap);
  React.useEffect(() => {
    if (!open || !list.current) return;
    const sel = list.current.querySelector<HTMLElement>('[aria-selected="true"]') || list.current.querySelector<HTMLElement>('[data-near="true"]');
    sel?.scrollIntoView({ block: 'center' });
    sel?.focus();
  }, [open]);
  const commit = (t: string) => {
    const v = parseTime(t);
    setBad(v === null);
    if (v !== null) {
      onChange(v);
      setText(v);
    }
  };
  const error = errorProp ?? (bad ? L('Not a valid time (HH:MM, 24-hour)', 'Μη έγκυρη ώρα (ΩΩ:ΛΛ, 24ωρο)') : undefined);
  const options = React.useMemo(() => timeOptions(step), [step]);
  const near = value ? options.find((o) => o >= value) : '09:00';
  return (
    <Field label={label} hint={hint} error={error} id={id}>
      <div ref={wrap} className={cx('cg-timefield', className)}>
        <input
          ref={ref}
          id={id}
          className="cg-input cg-input--mono"
          inputMode="numeric"
          autoComplete="off"
          placeholder={L('HH:MM', 'ΩΩ:ΛΛ')}
          value={text}
          disabled={disabled}
          aria-invalid={error != null || undefined}
          aria-describedby={(error ?? hint) != null ? `${id}-hint` : undefined}
          onChange={(e) => {
            const t = maskTime(e.target.value);
            setText(t);
            if (/^\d{2}:\d{2}$/.test(t)) commit(t);
          }}
          onBlur={(e) => {
            commit(text);
            onBlur?.(e);
          }}
          {...rest}
        />
        <IconButton variant="secondary" label={L('Pick a time', 'Επιλογή ώρας')} aria-expanded={open} aria-haspopup="listbox" disabled={disabled} onClick={() => setOpen((o) => !o)}>
          <ClockIcon />
        </IconButton>
        {open && (
          <div className="cg-popover cg-popover--list" role="listbox" aria-label={L('Pick a time', 'Επιλογή ώρας')} ref={list}>
            {options.map((o) => (
              <button
                key={o}
                type="button"
                role="option"
                aria-selected={o === value}
                data-near={o === near || undefined}
                className={cx('cg-timefield__option cg-mono', o === value && 'cg-timefield__option--selected')}
                onClick={() => {
                  onChange(o);
                  setText(o);
                  setBad(false);
                  setOpen(false);
                }}
              >
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
});
