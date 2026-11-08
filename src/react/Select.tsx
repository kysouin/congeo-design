import * as React from 'react';
import { cx } from './cx';
import { Field, type FieldProps } from './Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, FieldProps {}

/**
 * A native <select> in the Input chrome with a Lucide chevron. It never becomes a custom listbox, so the
 * iPhone keeps its native wheel. Pass <option> children.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, hint, error, className, id: idProp, children, ...rest }, ref) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} id={id}>
      <span className={cx('cg-select-wrap', rest.disabled && 'cg-select-wrap--disabled')}>
        <select ref={ref} id={id} className={cx('cg-input', 'cg-select', className)} aria-invalid={error != null || undefined} aria-describedby={(error ?? hint) != null ? `${id}-hint` : undefined} {...rest}>
          {children}
        </select>
        {/* lucide chevron-down */}
        <svg className="cg-select__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </Field>
  );
});
