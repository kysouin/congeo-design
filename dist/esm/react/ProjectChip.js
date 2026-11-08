import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from './cx.js';
import { accentAttrs } from './types.js';
/** Mono project number chip: «0637». */
export function ProjectChip({ number, accent, className, ...rest }) {
    return (_jsx("span", { className: cx('cg-chip', accent && 'cg-chip--tint', className), ...accentAttrs(accent), ...rest, children: String(number) }));
}
