import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { L } from '../i18n/core.js';
const defaultLabels = () => ({
    offline: L('Offline', 'Εκτός σύνδεσης'),
    sending: L('Sending', 'Αποστολή'),
    failed: L('Not sent', 'Αποτυχία αποστολής'),
    ok: L('Sent', 'Στάλθηκαν'),
});
/** Sync status: offline, sending, failed, with a count; ok («3 changes sent») hides itself after 4 s. */
export function StatusBar({ state, count, labels, autoHide, persist, onHide, className, children, ...rest }) {
    const delay = persist || autoHide === false ? null : autoHide !== null && autoHide !== void 0 ? autoHide : (state === 'ok' ? 4000 : null);
    const [hidden, setHidden] = React.useState(false);
    const onHideRef = React.useRef(onHide);
    onHideRef.current = onHide;
    React.useEffect(() => {
        setHidden(false);
        if (delay == null)
            return;
        const t = setTimeout(() => {
            var _a;
            setHidden(true);
            (_a = onHideRef.current) === null || _a === void 0 ? void 0 : _a.call(onHideRef);
        }, delay);
        return () => clearTimeout(t);
    }, [delay, state, count, children]);
    if (hidden)
        return null;
    const text = children !== null && children !== void 0 ? children : { ...defaultLabels(), ...labels }[state];
    return (_jsxs("div", { role: "status", className: cx('cg-statusbar', `cg-statusbar--${state}`, className), ...rest, children: [_jsx("span", { className: "cg-statusbar__dot", "aria-hidden": "true" }), _jsx("span", { className: "cg-statusbar__text", children: text }), count != null && _jsx("span", { className: "cg-statusbar__count", children: count })] }));
}
