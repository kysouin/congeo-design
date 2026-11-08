/**
 * Formatting through Intl, always in Europe/Nicosia. English is British (en-GB): 24-hour times, «12 Nov 2026».
 * Greek dates take the genitive month («12 Νοεμβρίου 2026») and a month heading the nominative («Νοέμβριος 2026»).
 */
import { getLang, langTag, type Lang } from './core.js';

export const TIME_ZONE = 'Europe/Nicosia';

export type DateStyle = 'long' | 'short' | 'numeric' | 'month' | 'dayMonth' | 'weekday';

type DateInput = Date | number | string;
const toDate = (d: DateInput): Date => (d instanceof Date ? d : new Date(d));

const cache = new Map<string, Intl.DateTimeFormat>();
function dtf(tag: string, opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = tag + JSON.stringify(opts);
  let f = cache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(tag, { timeZone: TIME_ZONE, ...opts });
    cache.set(key, f);
  }
  return f;
}

/** Year, month (1-12) and day of a moment, as the Nicosia calendar sees it. */
export function nicosiaParts(d: DateInput): { y: number; m: number; d: number } {
  const parts = dtf('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(toDate(d));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

/** Whole days from `from` to `to`, by the Nicosia calendar. */
export function dayDiff(to: DateInput, from: DateInput): number {
  const a = nicosiaParts(to);
  const b = nicosiaParts(from);
  return Math.round((Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d)) / 86400000);
}

export interface DateOptions {
  /** Add the year to a short date («Thu 12 Nov 2026»). Default: only when it is not the current year. */
  year?: boolean;
  /** Pass a fixed "now" (tests, previews). */
  now?: DateInput;
}

/**
 * long     «Thursday 12 November 2026» · «Πέμπτη 12 Νοεμβρίου 2026»
 * short    «Thu 12 Nov»                · «Πέμ 12 Νοε»
 * numeric  12/11/2026                  · 12/11/2026
 * month    «November 2026»             · «Νοέμβριος 2026» (nominative: a heading)
 * dayMonth «12 November»               · «12 Νοεμβρίου»
 * weekday  «Thursday»                  · «Πέμπτη»
 */
export function fmtDate(d: DateInput, style: DateStyle = 'long', opts: DateOptions = {}, lang: Lang = getLang()): string {
  const tag = langTag(lang);
  const date = toDate(d);
  switch (style) {
    case 'long':
      // en-GB puts a comma after the weekday; the house style does not
      return dtf(tag, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date).replace(/,/g, '');
    case 'short': {
      const withYear = opts.year ?? nicosiaParts(date).y !== nicosiaParts(opts.now ?? new Date()).y;
      return dtf(tag, { weekday: 'short', day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) })
        .format(date)
        .replace(/,/g, '');
    }
    case 'numeric':
      return dtf(tag, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    case 'month':
      return dtf(tag, { month: 'long', year: 'numeric' }).format(date);
    case 'dayMonth':
      return dtf(tag, { day: 'numeric', month: 'long' }).format(date);
    case 'weekday':
      return dtf(tag, { weekday: 'long' }).format(date);
  }
}

/** 24-hour time, «10:00», midnight «00:00». */
export function fmtTime(d: DateInput, lang: Lang = getLang()): string {
  return dtf(langTag(lang), { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(toDate(d));
}

/** «10:00–11:00» on one day; «Thu 12 Nov 10:00 – Fri 13 Nov 09:00» across days. */
export function fmtRange(a: DateInput, b: DateInput, lang: Lang = getLang()): string {
  const da = toDate(a);
  const db = toDate(b);
  if (dayDiff(db, da) === 0) return `${fmtTime(da, lang)}–${fmtTime(db, lang)}`;
  return `${fmtDate(da, 'short', {}, lang)} ${fmtTime(da, lang)} – ${fmtDate(db, 'short', {}, lang)} ${fmtTime(db, lang)}`;
}

/**
 * Relative to now: «now», «in 38 min», «12 min ago», «Today», «Yesterday», «Tomorrow», else a short date.
 * Greek: «τώρα», «σε 38′», «πριν 12′», «Σήμερα», «Χθες», «Αύριο».
 */
export function fmtRelative(d: DateInput, now: DateInput = new Date(), lang: Lang = getLang()): string {
  const date = toDate(d);
  const ref = toDate(now);
  const ms = date.getTime() - ref.getTime();
  const el = lang === 'el';
  if (Math.abs(ms) < 45_000) return el ? 'τώρα' : 'now';
  const min = Math.round(ms / 60_000);
  if (Math.abs(min) < 60) {
    const n = Math.abs(min);
    if (el) return min > 0 ? `σε ${n}′` : `πριν ${n}′`;
    return min > 0 ? `in ${n} min` : `${n} min ago`;
  }
  const days = dayDiff(date, ref);
  if (days === 0) return el ? 'Σήμερα' : 'Today';
  if (days === -1) return el ? 'Χθες' : 'Yesterday';
  if (days === 1) return el ? 'Αύριο' : 'Tomorrow';
  return fmtDate(date, 'short', { now: ref }, lang);
}

/** «€1,234.50» · «1.234,50 €» (the space before € is the non-breaking one Intl gives). */
export function fmtMoney(amount: number, currency = 'EUR', lang: Lang = getLang()): string {
  return new Intl.NumberFormat(langTag(lang), { style: 'currency', currency }).format(amount);
}

/** A number as the language writes it: 1,234.5 · 1.234,5. `digits` fixes the decimals. */
export function num(value: number | string | null | undefined, digits?: number, lang: Lang = getLang()): string {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '–';
  const o: Intl.NumberFormatOptions = digits === undefined ? { maximumFractionDigits: 3 } : { minimumFractionDigits: digits, maximumFractionDigits: digits };
  return new Intl.NumberFormat(langTag(lang), o).format(Number(value));
}

const rules = new Map<Lang, Intl.PluralRules>();
function isOne(n: number, lang: Lang): boolean {
  let r = rules.get(lang);
  if (!r) {
    r = new Intl.PluralRules(langTag(lang));
    rules.set(lang, r);
  }
  return r.select(n) === 'one';
}

export type Forms = readonly [one: string, other: string];

/**
 * A count with its word: plural(1, ['change', 'changes'], ['αλλαγή', 'αλλαγές']) → «1 change» · «1 αλλαγή»;
 * plural(3, …) → «3 changes» · «3 αλλαγές»; 0 takes the plural in both languages. `bare` leaves the number out.
 */
export function plural(n: number, en: Forms, el: Forms, bare = false, lang: Lang = getLang()): string {
  const f = lang === 'el' ? el : en;
  const w = isOne(n, lang) ? f[0] : f[1];
  return bare ? w : `${num(n, 0, lang)} ${w}`;
}

/**
 * The word that agrees with a count, for verbs and adjectives: verb(3, 'Sent', ['Στάλθηκε', 'Στάλθηκαν']) → «Sent» ·
 * «Στάλθηκαν». English may pass one form when it does not change.
 */
export function verb(n: number, en: string | Forms, el: Forms, lang: Lang = getLang()): string {
  if (lang === 'el') return isOne(n, lang) ? el[0] : el[1];
  return typeof en === 'string' ? en : isOne(n, lang) ? en[0] : en[1];
}
