/**
 * The interface language of every CONGEO tool. Framework-agnostic.
 *
 * - `en` by default on a first visit, whatever the browser says; or `el`.
 * - One choice for all tools: cookie `congeo_lang` on `.congeo.cy` (Path=/, one year, SameSite=Lax, Secure on https),
 *   with localStorage `congeo.lang` as the fallback on other hosts (previews, localhost). Never a server round trip.
 * - Strings are written inline, English first: L('Save changes', 'Αποθήκευση αλλαγών'). The string sits next to its
 *   use, so it is read and reviewed where it matters, and a script can extract every L() call later if a third
 *   language comes. This is the pattern Rhoi and congeo-pdf already use.
 * - The document language (a design, an invoice, an exported PDF) is a separate setting per project or document.
 *   `inLang('el', () => …)` renders inside it without touching the interface language or what is remembered of it.
 */
export type Lang = 'en' | 'el';

export const LANGS: readonly Lang[] = ['en', 'el'];
export const COOKIE_NAME = 'congeo_lang';
export const STORAGE_KEY = 'congeo.lang';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DEFAULT_LANG: Lang = 'en';

type Config = {
  /** Cookie domains that share the choice. The first one whose suffix matches the host is used. */
  cookieDomains: string[];
  /** A tool that has one language only (PermitFlow: Greek). Nothing is read or written. */
  fixed: Lang | null;
};

const config: Config = { cookieDomains: ['.congeo.cy'], fixed: null };

const hasDoc = () => typeof document !== 'undefined';
const hasWin = () => typeof window !== 'undefined';

function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'el';
}

function readMetaDomains(): string[] {
  if (!hasDoc()) return [];
  const meta = document.querySelector('meta[name="congeo-lang-domains"]');
  const content = meta?.getAttribute('content') || '';
  return content.split(',').map((s) => s.trim()).filter(Boolean);
}

function cookieDomain(): string | null {
  if (!hasWin()) return null;
  const host = window.location.hostname;
  for (const d of [...config.cookieDomains, ...readMetaDomains()]) {
    const bare = d.replace(/^\./, '');
    if (host === bare || host.endsWith('.' + bare)) return '.' + bare;
  }
  return null;
}

function readCookie(): Lang | null {
  if (!hasDoc()) return null;
  const m = new RegExp('(?:^|;\\s*)' + COOKIE_NAME + '=(en|el)(?:;|$)').exec(document.cookie || '');
  return m ? (m[1] as Lang) : null;
}

function readStorage(): Lang | null {
  try {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

/** What is remembered: the cookie first (shared across tools), then localStorage. */
export function readStoredLang(): Lang | null {
  return readCookie() ?? readStorage();
}

function writeStored(l: Lang) {
  const domain = cookieDomain();
  if (hasDoc() && domain) {
    const secure = hasWin() && window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE_NAME}=${l}; Domain=${domain}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  }
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, l);
  } catch {
    /* private mode */
  }
}

let lang: Lang = readStoredLang() ?? DEFAULT_LANG;
let scope: Lang | null = null;
const subs = new Set<(l: Lang) => void>();

function apply() {
  if (hasDoc()) document.documentElement.lang = lang;
}

function notify() {
  subs.forEach((f) => {
    try {
      f(lang);
    } catch {
      /* a listener must not break the others */
    }
  });
}

// the page says its language from the start (screen readers, hyphenation, Greek uppercase, the browser's translate offer)
apply();

/** The language strings come out in: the document scope while one is open, else the interface language. */
export const getLang = (): Lang => scope ?? lang;
/** The interface language alone. */
export const uiLang = (): Lang => lang;
/** BCP 47 tag for Intl: en-GB or el-GR. */
export const langTag = (l: Lang = getLang()): 'en-GB' | 'el-GR' => (l === 'el' ? 'el-GR' : 'en-GB');
export const otherLang = (l: Lang = lang): Lang => (l === 'el' ? 'en' : 'el');

/** Changes the interface language for every tool: remembered, applied to <html lang>, listeners called. */
export function setLang(l: Lang) {
  if (!isLang(l)) return;
  if (config.fixed) return;
  const changed = l !== lang;
  lang = l;
  writeStored(l);
  apply();
  if (changed) notify();
}

/** Called after a change here or in another tool (on the next load, on visibilitychange). Returns the unsubscribe. */
export function onLangChange(fn: (l: Lang) => void): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

/** Re-reads what is remembered. Another tool may have changed it while this one was in the background. */
export function syncLang(): Lang {
  if (config.fixed) return lang;
  const stored = readStoredLang();
  if (stored && stored !== lang) {
    lang = stored;
    apply();
    notify();
  }
  return lang;
}

/**
 * Settings for a tool. `cookieDomains` adds hosts that share the choice (the default is .congeo.cy; a
 * <meta name="congeo-lang-domains" content=".congeo.cy,.congeo.test"> tag does the same). `fixed` pins a tool to
 * one language (PermitFlow is Greek only): then nothing is read or remembered.
 */
export function configureLang(opts: Partial<Config>) {
  if (opts.cookieDomains) config.cookieDomains = opts.cookieDomains.slice();
  if (opts.fixed !== undefined) {
    config.fixed = opts.fixed;
    if (opts.fixed) {
      lang = opts.fixed;
      apply();
      notify();
      return;
    }
  }
  const stored = readStoredLang();
  if (stored && stored !== lang) {
    lang = stored;
    apply();
    notify();
  }
}

/** Inline string: English first, Greek second. */
export function L(en: string, el: string): string {
  return getLang() === 'el' ? el : en;
}

/** The right field of an object carrying both, {en, el}, falling back to the other. */
export function LL(o: { en?: string | null; el?: string | null } | null | undefined, fallback = ''): string {
  if (!o) return fallback;
  return (getLang() === 'el' ? o.el || o.en : o.en || o.el) || fallback;
}

/**
 * Renders inside a document language. While `fn` runs, L() and the formatters speak `l`. The interface language
 * and what is remembered are untouched. A document already made is never changed by the interface switch.
 */
export function inLang<T>(l: Lang | null | undefined, fn: () => T): T {
  if (!l) return fn();
  const prev = scope;
  scope = l;
  try {
    return fn();
  } finally {
    scope = prev;
  }
}

if (hasDoc()) {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') syncLang();
  });
  if (hasWin()) {
    window.addEventListener('pageshow', () => syncLang());
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY || e.key === null) syncLang();
    });
  }
}

/**
 * A tiny inline script for <head>, before any stylesheet: sets <html lang> from the cookie or localStorage before
 * the first paint, so the page never flashes the wrong language and Greek uppercase is right from the first frame.
 * Put it in index.html as <script>…</script>. Tools pinned to one language set lang="el" on <html> instead.
 */
export const LANG_BOOT_SCRIPT =
  '(function(){var l=null;try{var m=/(?:^|;\\s*)congeo_lang=(en|el)(?:;|$)/.exec(document.cookie||"");l=m?m[1]:null;' +
  'if(!l){var s=localStorage.getItem("congeo.lang");if(s==="en"||s==="el")l=s}}catch(e){}document.documentElement.lang=l||"en"})();';
