import * as React from 'react';
import { cx } from './cx';
import { Segmented } from './Segmented';
import { onLangChange, setLang, uiLang, L, type Lang } from '../i18n/core.js';

/** The interface language; the component re-renders when it changes, here or in another tool. */
export function useLang(): Lang {
  const [, force] = React.useState(0);
  React.useEffect(() => onLangChange(() => force((x) => x + 1)), []);
  return uiLang();
}

export interface LanguageSwitchProps {
  className?: string;
  block?: boolean;
  /** Called after the language changed (the switch itself already called setLang). */
  onChange?: (lang: Lang) => void;
}

/** «EN | ΕΛ». Each label is in its own language, so it reads correctly whichever one is set. */
export function LanguageSwitch({ className, block, onChange }: LanguageSwitchProps) {
  const lang = useLang();
  return (
    <Segmented<Lang>
      label={L('Language', 'Γλώσσα')}
      className={cx('cg-langswitch', className)}
      block={block}
      value={lang}
      onChange={(l) => {
        setLang(l);
        onChange?.(l);
      }}
      options={[
        { value: 'en', label: <span lang="en" aria-label="English">EN</span> },
        { value: 'el', label: <span lang="el" aria-label="Ελληνικά">ΕΛ</span> }, // cg-lint-ignore: each label names its own language
      ]}
    />
  );
}
