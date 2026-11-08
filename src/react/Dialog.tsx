import * as React from 'react';
import { cx } from './cx.js';
import { IconButton } from './Button.js';
import { Sheet } from './Sheet.js';
import { L } from '../i18n/core.js';
import { DESKTOP_QUERY, useMediaQuery, useModalFocus } from './focus.js';

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  /** Footer actions: secondary first (left), primary last (right). */
  footer?: React.ReactNode;
  /** Modal width from 900 px up. Default 560. */
  maxWidth?: number;
  /** Force one container (documentation, tests). Default: by the screen width. */
  variant?: 'auto' | 'modal' | 'sheet';
  /** Render in flow, open, without a backdrop (documentation). */
  inline?: boolean;
  closeButton?: boolean;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/**
 * The right container per screen: a bottom Sheet on a phone, a centred modal from 900 px up. Title, body,
 * footer actions (secondary left, primary right), Escape, backdrop, focus trap and return, on both.
 *
 * Use Dialog for a decision or a short form that interrupts; use SidePanel to edit one item while the list
 * stays in view (calendar's editor).
 */
export function Dialog({ open, onClose, title, footer, maxWidth = 560, variant = 'auto', inline, closeButton = true, className, children, style, ...rest }: DialogProps) {
  const desktop = useMediaQuery(DESKTOP_QUERY, false);
  const asModal = variant === 'modal' || (variant === 'auto' && desktop);
  const panel = React.useRef<HTMLDivElement>(null);
  useModalFocus(open && asModal && !inline, panel, onClose);

  if (!open) return null;
  const head = (title != null || closeButton) && (
    <div className="cg-dialog__head">
      {title != null && <h2 className="cg-dialog__title">{title}</h2>}
      {closeButton && (
        <IconButton variant="ghost" size="sm" label={L('Close', 'Κλείσιμο')} onClick={() => onClose?.()}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
  const body = <div className="cg-dialog__body">{children}</div>;
  const foot = footer && <div className="cg-dialog__foot">{footer}</div>;

  if (!asModal) {
    return (
      <Sheet open onClose={onClose} inline={inline} className={cx('cg-dialog cg-dialog--sheet', className)} style={style} {...rest}>
        {head}
        {body}
        {foot}
      </Sheet>
    );
  }
  const modal = (
    <div
      ref={panel}
      role="dialog"
      aria-modal={!inline}
      tabIndex={-1}
      className={cx('cg-dialog cg-dialog--modal', inline && 'cg-dialog--inline', className)}
      style={{ ...style, maxWidth }}
      {...rest}
    >
      {head}
      {body}
      {foot}
    </div>
  );
  if (inline) return modal;
  return (
    <div className="cg-dialog-layer">
      <div className="cg-sheet-backdrop" onClick={() => onClose?.()} aria-hidden="true" />
      {modal}
    </div>
  );
}

export interface SidePanelProps extends Omit<DialogProps, 'maxWidth' | 'variant'> {
  /** Panel width from 900 px up. Default 420. */
  width?: number;
  variant?: 'auto' | 'panel' | 'sheet';
}

/**
 * A bottom Sheet on a phone, a right-hand side panel from 900 px up: for editing one item while the rest of
 * the screen stays in view. Same head, body and footer as Dialog.
 */
export function SidePanel({ open, onClose, title, footer, width = 420, variant = 'auto', inline, closeButton = true, className, children, style, ...rest }: SidePanelProps) {
  const desktop = useMediaQuery(DESKTOP_QUERY, false);
  const asPanel = variant === 'panel' || (variant === 'auto' && desktop);
  const panel = React.useRef<HTMLElement>(null);
  useModalFocus(open && asPanel && !inline, panel, onClose);
  if (!open) return null;
  const head = (title != null || closeButton) && (
    <div className="cg-dialog__head">
      {title != null && <h2 className="cg-dialog__title">{title}</h2>}
      {closeButton && (
        <IconButton variant="ghost" size="sm" label={L('Close', 'Κλείσιμο')} onClick={() => onClose?.()}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
  const body = <div className="cg-dialog__body">{children}</div>;
  const foot = footer && <div className="cg-dialog__foot">{footer}</div>;
  if (!asPanel) {
    return (
      <Sheet open onClose={onClose} inline={inline} className={cx('cg-dialog cg-dialog--sheet', className)} style={style} {...rest}>
        {head}
        {body}
        {foot}
      </Sheet>
    );
  }
  const aside = (
    <aside ref={panel} role="dialog" aria-modal={!inline} tabIndex={-1} className={cx('cg-dialog cg-sidepanel', inline && 'cg-sidepanel--inline', className)} style={{ ...style, width }} {...rest}>
      {head}
      {body}
      {foot}
    </aside>
  );
  if (inline) return aside;
  return (
    <div className="cg-dialog-layer cg-dialog-layer--side">
      <div className="cg-sheet-backdrop" onClick={() => onClose?.()} aria-hidden="true" />
      {aside}
    </div>
  );
}
