import * as React from 'react';
import { cx } from './cx.js';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
}

/** An on/off control with label and description. role="switch", 44 px target, Space and Enter toggle. */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ checked, onChange, label, description, className, id: idProp, disabled, onClick, ...rest }, ref) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-describedby={description != null ? `${id}-desc` : undefined}
      disabled={disabled}
      className={cx('cg-switch', className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onChange(!checked);
      }}
      {...rest}
    >
      <span className="cg-switch__text">
        <span className="cg-switch__label">{label}</span>
        {description != null && (
          <span className="cg-switch__desc" id={`${id}-desc`}>
            {description}
          </span>
        )}
      </span>
      <span className="cg-switch__track" aria-hidden="true">
        <span className="cg-switch__thumb" />
      </span>
    </button>
  );
});
