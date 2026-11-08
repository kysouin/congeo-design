import * as React from 'react';
import { type Lang } from '../i18n/core.js';
/** The interface language; the component re-renders when it changes, here or in another tool. */
export declare function useLang(): Lang;
export interface LanguageSwitchProps {
    className?: string;
    block?: boolean;
    /** Called after the language changed (the switch itself already called setLang). */
    onChange?: (lang: Lang) => void;
}
/** «EN | ΕΛ». Each label is in its own language, so it reads correctly whichever one is set. */
export declare function LanguageSwitch({ className, block, onChange }: LanguageSwitchProps): React.JSX.Element;
