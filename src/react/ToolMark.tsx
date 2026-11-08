import * as React from 'react';
import { cx } from './cx.js';
import type { ToolId } from './types.js';

export const TOOL_LABELS: Record<ToolId, string> = {
  kaneto: 'Kaneto',
  rhoi: 'Rhoi',
  trace: 'Trace',
  permitflow: 'PermitFlow',
  internal: 'CONGEO',
};

export interface ToolMarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  tool: ToolId;
  /** Override the displayed name (e.g. "Ημερολόγιο" for an internal tool). */
  label?: string;
  size?: 'md' | 'lg';
}

/** The tool's colour dot and its name. */
export function ToolMark({ tool, label, size = 'md', className, ...rest }: ToolMarkProps) {
  return (
    <span className={cx('cg-toolmark', size === 'lg' && 'cg-toolmark--lg', className)} data-tool={tool} {...rest}>
      <span className="cg-toolmark__dot" aria-hidden="true" />
      <span className="cg-toolmark__name">{label ?? TOOL_LABELS[tool]}</span>
    </span>
  );
}
