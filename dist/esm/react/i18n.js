import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cx } from './cx.js';
import { Segmented } from './Segmented.js';
import { onLangChange, setLang, uiLang, L } from '../i18n/core.js';
/** The interface language; the component re-renders when it changes, here or in another tool. */
export function useLang() {
    const [, force] = React.useState(0);
    React.useEffect(() => onLangChange(() => force((x) => x + 1)), []);
    return uiLang();
}
/** «EN | ΕΛ». Each label is in its own language, so it reads correctly whichever one is set. */
export function LanguageSwitch({ className, block, onChange }) {
    const lang = useLang();
    return (_jsx(Segmented, { label: L('Language', 'Γλώσσα'), className: cx('cg-langswitch', className), block: block, value: lang, onChange: (l) => {
            setLang(l);
            onChange === null || onChange === void 0 ? void 0 : onChange(l);
        }, options: [
            { value: 'en', label: _jsx("span", { lang: "en", "aria-label": "English", children: "EN" }) },
            { value: 'el', label: _jsx("span", { lang: "el", "aria-label": "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC", children: "\u0395\u039B" }) }, // cg-lint-ignore: each label names its own language
        ] }));
}
