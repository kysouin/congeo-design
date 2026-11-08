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
export declare const LANGS: readonly Lang[];
export declare const COOKIE_NAME = "congeo_lang";
export declare const STORAGE_KEY = "congeo.lang";
export declare const COOKIE_MAX_AGE: number;
type Config = {
    /** Cookie domains that share the choice. The first one whose suffix matches the host is used. */
    cookieDomains: string[];
    /** A tool that has one language only (PermitFlow: Greek). Nothing is read or written. */
    fixed: Lang | null;
};
/** What is remembered: the cookie first (shared across tools), then localStorage. */
export declare function readStoredLang(): Lang | null;
/** The language strings come out in: the document scope while one is open, else the interface language. */
export declare const getLang: () => Lang;
/** The interface language alone. */
export declare const uiLang: () => Lang;
/** BCP 47 tag for Intl: en-GB or el-GR. */
export declare const langTag: (l?: Lang) => 'en-GB' | 'el-GR';
export declare const otherLang: (l?: Lang) => Lang;
/** Changes the interface language for every tool: remembered, applied to <html lang>, listeners called. */
export declare function setLang(l: Lang): void;
/** Called after a change here or in another tool (on the next load, on visibilitychange). Returns the unsubscribe. */
export declare function onLangChange(fn: (l: Lang) => void): () => void;
/** Re-reads what is remembered. Another tool may have changed it while this one was in the background. */
export declare function syncLang(): Lang;
/**
 * Settings for a tool. `cookieDomains` adds hosts that share the choice (the default is .congeo.cy; a
 * <meta name="congeo-lang-domains" content=".congeo.cy,.congeo.test"> tag does the same). `fixed` pins a tool to
 * one language (PermitFlow is Greek only): then nothing is read or remembered.
 */
export declare function configureLang(opts: Partial<Config>): void;
/** Inline string: English first, Greek second. */
export declare function L(en: string, el: string): string;
/** The right field of an object carrying both, {en, el}, falling back to the other. */
export declare function LL(o: {
    en?: string | null;
    el?: string | null;
} | null | undefined, fallback?: string): string;
/**
 * Renders inside a document language. While `fn` runs, L() and the formatters speak `l`. The interface language
 * and what is remembered are untouched. A document already made is never changed by the interface switch.
 */
export declare function inLang<T>(l: Lang | null | undefined, fn: () => T): T;
/**
 * A tiny inline script for <head>, before any stylesheet: sets <html lang> from the cookie or localStorage before
 * the first paint, so the page never flashes the wrong language and Greek uppercase is right from the first frame.
 * Put it in index.html as <script>…</script>. Tools pinned to one language set lang="el" on <html> instead.
 */
export declare const LANG_BOOT_SCRIPT: string;
export {};
