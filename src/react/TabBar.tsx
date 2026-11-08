import * as React from 'react';
import { cx } from './cx';
import { L } from '../i18n/core.js';

export interface TabBarItem {
  key: string;
  label: React.ReactNode;
  /** A Lucide icon element, size 24. */
  icon: React.ReactNode;
  href?: string;
}

export interface TabBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Exactly four items. */
  items: [TabBarItem, TabBarItem, TabBarItem, TabBarItem] | TabBarItem[];
  value: string;
  onChange?: (key: string) => void;
  /** Render in flow instead of floating (for documentation). */
  inline?: boolean;
  label?: string;
}

/** Floating, safe-area aware tab bar with 4 items. */
export function TabBar({ items, value, onChange, inline, label, className, ...rest }: TabBarProps) {
  return (
    <nav aria-label={label ?? L('Navigation', 'Πλοήγηση')} className={cx('cg-tabbar', inline && 'cg-tabbar--inline', className)} {...rest}>
      {items.slice(0, 4).map((it) => {
        const active = it.key === value;
        const Tag: any = it.href ? 'a' : 'button';
        return (
          <Tag
            key={it.key}
            href={it.href}
            type={it.href ? undefined : 'button'}
            aria-current={active ? 'page' : undefined}
            className="cg-tabbar__item"
            onClick={() => onChange?.(it.key)}
          >
            {it.icon}
            <span className="cg-tabbar__label">{it.label}</span>
          </Tag>
        );
      })}
    </nav>
  );
}

/** Reserves space at the end of a scrolling screen so content is not hidden under the floating bar. */
export function TabBarSpacer() {
  return <div className="cg-tabbar-spacer" aria-hidden="true" />;
}
