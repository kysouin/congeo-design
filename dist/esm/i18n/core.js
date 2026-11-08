export const LANGS = ['en', 'el'];
export const COOKIE_NAME = 'congeo_lang';
export const STORAGE_KEY = 'congeo.lang';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DEFAULT_LANG = 'en';
const STATE_KEY = Symbol.for('congeo.i18n');
const hasDoc = () => typeof document !== 'undefined';
const hasWin = () => typeof window !== 'undefined';
function isLang(v) {
    return v === 'en' || v === 'el';
}
function readMetaDomains() {
    if (!hasDoc())
        return [];
    const meta = document.querySelector('meta[name="congeo-lang-domains"]');
    const content = (meta === null || meta === void 0 ? void 0 : meta.getAttribute('content')) || '';
    return content.split(',').map((s) => s.trim()).filter(Boolean);
}
function cookieDomain() {
    if (!hasWin())
        return null;
    const host = window.location.hostname;
    for (const d of [...S.config.cookieDomains, ...readMetaDomains()]) {
        const bare = d.replace(/^\./, '');
        if (host === bare || host.endsWith('.' + bare))
            return '.' + bare;
    }
    return null;
}
function readCookie() {
    if (!hasDoc())
        return null;
    const m = new RegExp('(?:^|;\\s*)' + COOKIE_NAME + '=(en|el)(?:;|$)').exec(document.cookie || '');
    return m ? m[1] : null;
}
function readStorage() {
    try {
        const v = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        return isLang(v) ? v : null;
    }
    catch {
        return null;
    }
}
/** What is remembered: the cookie first (shared across tools), then localStorage. */
export function readStoredLang() {
    var _a;
    return (_a = readCookie()) !== null && _a !== void 0 ? _a : readStorage();
}
function writeStored(l) {
    const domain = cookieDomain();
    if (hasDoc() && domain) {
        const secure = hasWin() && window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${COOKIE_NAME}=${l}; Domain=${domain}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
    }
    try {
        if (typeof localStorage !== 'undefined')
            localStorage.setItem(STORAGE_KEY, l);
    }
    catch {
        /* private mode */
    }
}
const S = (() => {
    var _a;
    const g = globalThis;
    const existing = g[STATE_KEY];
    if (existing)
        return existing;
    const fresh = {
        lang: (_a = readStoredLang()) !== null && _a !== void 0 ? _a : DEFAULT_LANG,
        scope: null,
        subs: new Set(),
        config: { cookieDomains: ['.congeo.cy'], fixed: null },
        wired: false,
    };
    g[STATE_KEY] = fresh;
    return fresh;
})();
function apply() {
    if (hasDoc())
        document.documentElement.lang = S.lang;
}
function notify() {
    S.subs.forEach((f) => {
        try {
            f(S.lang);
        }
        catch {
            /* a listener must not break the others */
        }
    });
}
// the page says its language from the start (screen readers, hyphenation, Greek uppercase, the browser's translate offer)
apply();
/** The language strings come out in: the document scope while one is open, else the interface language. */
export const getLang = () => { var _a; return (_a = S.scope) !== null && _a !== void 0 ? _a : S.lang; };
/** The interface language alone. */
export const uiLang = () => S.lang;
/** BCP 47 tag for Intl: en-GB or el-GR. */
export const langTag = (l = getLang()) => (l === 'el' ? 'el-GR' : 'en-GB');
export const otherLang = (l = S.lang) => (l === 'el' ? 'en' : 'el');
/** Changes the interface language for every tool: remembered, applied to <html lang>, listeners called. */
export function setLang(l) {
    if (!isLang(l))
        return;
    if (S.config.fixed)
        return;
    const changed = l !== S.lang;
    S.lang = l;
    writeStored(l);
    apply();
    if (changed)
        notify();
}
/** Called after a change here or in another tool (on the next load, on visibilitychange). Returns the unsubscribe. */
export function onLangChange(fn) {
    S.subs.add(fn);
    return () => {
        S.subs.delete(fn);
    };
}
/** Re-reads what is remembered. Another tool may have changed it while this one was in the background. */
export function syncLang() {
    if (S.config.fixed)
        return S.lang;
    const stored = readStoredLang();
    if (stored && stored !== S.lang) {
        S.lang = stored;
        apply();
        notify();
    }
    return S.lang;
}
/**
 * Settings for a tool. `cookieDomains` adds hosts that share the choice (the default is .congeo.cy; a
 * <meta name="congeo-lang-domains" content=".congeo.cy,.congeo.test"> tag does the same). `fixed` pins a tool to
 * one language (PermitFlow is Greek only): then nothing is read or remembered.
 */
export function configureLang(opts) {
    if (opts.cookieDomains)
        S.config.cookieDomains = opts.cookieDomains.slice();
    if (opts.fixed !== undefined) {
        S.config.fixed = opts.fixed;
        if (opts.fixed) {
            S.lang = opts.fixed;
            apply();
            notify();
            return;
        }
    }
    const stored = readStoredLang();
    if (stored && stored !== S.lang) {
        S.lang = stored;
        apply();
        notify();
    }
}
/** Inline string: English first, Greek second. */
export function L(en, el) {
    return getLang() === 'el' ? el : en;
}
/** The right field of an object carrying both, {en, el}, falling back to the other. */
export function LL(o, fallback = '') {
    if (!o)
        return fallback;
    return (getLang() === 'el' ? o.el || o.en : o.en || o.el) || fallback;
}
/**
 * Renders inside a document language. While `fn` runs, L() and the formatters speak `l`. The interface language
 * and what is remembered are untouched. A document already made is never changed by the interface switch.
 */
export function inLang(l, fn) {
    if (!l)
        return fn();
    const prev = S.scope;
    S.scope = l;
    try {
        return fn();
    }
    finally {
        S.scope = prev;
    }
}
// the listeners are wired once, by whichever copy loads first
if (hasDoc() && !S.wired) {
    S.wired = true;
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'hidden')
            syncLang();
    });
    if (hasWin()) {
        window.addEventListener('pageshow', () => syncLang());
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY || e.key === null)
                syncLang();
        });
    }
}
/**
 * A tiny inline script for <head>, before any stylesheet: sets <html lang> from the cookie or localStorage before
 * the first paint, so the page never flashes the wrong language and Greek uppercase is right from the first frame.
 * Put it in index.html as <script>…</script>. Tools pinned to one language set lang="el" on <html> instead.
 */
export const LANG_BOOT_SCRIPT = '(function(){var l=null;try{var m=/(?:^|;\\s*)congeo_lang=(en|el)(?:;|$)/.exec(document.cookie||"");l=m?m[1]:null;' +
    'if(!l){var s=localStorage.getItem("congeo.lang");if(s==="en"||s==="el")l=s}}catch(e){}document.documentElement.lang=l||"en"})();';
