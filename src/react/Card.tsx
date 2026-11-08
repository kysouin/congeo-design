import * as React from 'react';
import { cx } from './cx';
import { Accent, accentAttrs } from './types';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  size?: 'md' | 'lg';
  raised?: boolean;
  flat?: boolean;
  /** Fill with the tool/status tint. */
  tint?: Accent;
  title?: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'li';
}

export function Card({ size = 'md', raised, flat, tint, title, as = 'div', className, children, ...rest }: CardProps) {
  const Tag: any = as;
  return (
    <Tag
      className={cx('cg-card', size === 'lg' && 'cg-card--lg', raised && 'cg-card--raised', flat && 'cg-card--flat', tint && 'cg-card--tint', className)}
      {...accentAttrs(tint)}
      {...rest}
    >
      {title != null && <h3 className="cg-card__title">{title}</h3>}
      {children}
    </Tag>
  );
}
