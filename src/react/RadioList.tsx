import * as React from 'react';
import { cx } from './cx.js';

export interface RadioOption<T extends string> {
  value: T;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** A trailing mark: a badge, an icon, a count. */
  mark?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioListProps<T extends string> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: RadioOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label?: string;
}

/** A vertical list of options with label, description and trailing mark. radiogroup; arrow keys move the selection. */
export function RadioList<T extends string>({ options, value, onChange, label, className, ...rest }: RadioListProps<T>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const cur = options.findIndex((o) => o.value === value);
    const pos = enabled.indexOf(cur);
    let next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = enabled[(pos + 1) % enabled.length];
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = enabled[(pos - 1 + enabled.length) % enabled.length];
    if (e.key === 'Home') next = enabled[0];
    if (e.key === 'End') next = enabled[enabled.length - 1];
    if (next !== undefined && next >= 0) {
      e.preventDefault();
      onChange(options[next].value);
      refs.current[next]?.focus();
    }
  };
  const firstTab = value == null ? enabled[0] : -1;
  return (
    <div role="radiogroup" aria-label={label} className={cx('cg-radiolist', className)} onKeyDown={onKeyDown} {...rest}>
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={o.disabled}
            tabIndex={selected || i === firstTab ? 0 : -1}
            className={cx('cg-radio', selected && 'cg-radio--selected')}
            onClick={() => onChange(o.value)}
          >
            <span className="cg-radio__dot" aria-hidden="true" />
            <span className="cg-radio__text">
              <span className="cg-radio__label">{o.label}</span>
              {o.description != null && <span className="cg-radio__desc">{o.description}</span>}
            </span>
            {o.mark != null && <span className="cg-radio__mark">{o.mark}</span>}
          </button>
        );
      })}
    </div>
  );
}
