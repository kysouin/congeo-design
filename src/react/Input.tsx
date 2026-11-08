import * as React from 'react';
import { cx } from './cx';

export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
}

/** The label / hint / error chrome around a control. The control must carry `id`. */
export function Field({ label, hint, error, id, children }: FieldProps & { id: string; children: React.ReactNode }) {
  const hasChrome = label != null || hint != null || error != null;
  if (!hasChrome) return <>{children}</>;
  return (
    <div className={cx('cg-field', error != null && 'cg-field--error')}>
      {label != null && (
        <label className="cg-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {(error ?? hint) != null && (
        <span className="cg-field__hint" id={`${id}-hint`}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, FieldProps {
  mono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, mono, className, id: idProp, ...rest },
  ref,
) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} id={id}>
      <input
        ref={ref}
        id={id}
        className={cx('cg-input', mono && 'cg-input--mono', className)}
        aria-invalid={error != null || undefined}
        aria-describedby={(error ?? hint) != null ? `${id}-hint` : undefined}
        {...rest}
      />
    </Field>
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {
  /** Maximum rows before it scrolls. */
  maxRows?: number;
  /** When set, Enter submits instead of adding a line (Shift+Enter still adds one). */
  onSubmit?: () => void;
}

/** Textarea that grows with its text. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, maxRows = 8, className, id: idProp, onInput, onKeyDown, onSubmit, rows = 1, style, ...rest },
  ref,
) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const inner = React.useRef<HTMLTextAreaElement | null>(null);

  const resize = React.useCallback(() => {
    const el = inner.current;
    if (!el) return;
    el.style.height = 'auto';
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || 22;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const max = line * maxRows + pad;
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }, [maxRows]);

  React.useLayoutEffect(() => {
    resize();
  });

  return (
    <Field label={label} hint={hint} error={error} id={id}>
      <textarea
        ref={(el) => {
          inner.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
        }}
        id={id}
        rows={rows}
        className={cx('cg-textarea', className)}
        aria-invalid={error != null || undefined}
        aria-describedby={(error ?? hint) != null ? `${id}-hint` : undefined}
        style={style}
        onInput={(e) => {
          onInput?.(e);
          resize();
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (onSubmit && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && !e.defaultPrevented) {
            e.preventDefault();
            onSubmit();
          }
        }}
        enterKeyHint={onSubmit ? 'done' : undefined}
        {...rest}
      />
    </Field>
  );
});
