import * as React from 'react';
import type { ToolId } from './types.js';
export declare const TOOL_LABELS: Record<ToolId, string>;
export interface ToolMarkProps extends React.HTMLAttributes<HTMLSpanElement> {
    tool: ToolId;
    /** Override the displayed name (e.g. "Ημερολόγιο" for an internal tool). */
    label?: string;
    size?: 'md' | 'lg';
}
/** The tool's colour dot and its name. */
export declare function ToolMark({ tool, label, size, className, ...rest }: ToolMarkProps): React.JSX.Element;
