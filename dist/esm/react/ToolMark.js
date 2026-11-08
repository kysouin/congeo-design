import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './cx.js';
export const TOOL_LABELS = {
    kaneto: 'Kaneto',
    rhoi: 'Rhoi',
    trace: 'Trace',
    permitflow: 'PermitFlow',
    internal: 'CONGEO',
};
/** The tool's colour dot and its name. */
export function ToolMark({ tool, label, size = 'md', className, ...rest }) {
    return (_jsxs("span", { className: cx('cg-toolmark', size === 'lg' && 'cg-toolmark--lg', className), "data-tool": tool, ...rest, children: [_jsx("span", { className: "cg-toolmark__dot", "aria-hidden": "true" }), _jsx("span", { className: "cg-toolmark__name", children: label !== null && label !== void 0 ? label : TOOL_LABELS[tool] })] }));
}
