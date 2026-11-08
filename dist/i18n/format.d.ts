/**
 * Formatting through Intl, always in Europe/Nicosia. English is British (en-GB): 24-hour times, «12 Nov 2026».
 * Greek dates take the genitive month («12 Νοεμβρίου 2026») and a month heading the nominative («Νοέμβριος 2026»).
 */
import { type Lang } from './core.js';
export declare const TIME_ZONE = "Europe/Nicosia";
export type DateStyle = 'long' | 'short' | 'numeric' | 'month' | 'dayMonth' | 'weekday';
type DateInput = Date | number | string;
/** Year, month (1-12) and day of a moment, as the Nicosia calendar sees it. */
export declare function nicosiaParts(d: DateInput): {
    y: number;
    m: number;
    d: number;
};
/** Whole days from `from` to `to`, by the Nicosia calendar. */
export declare function dayDiff(to: DateInput, from: DateInput): number;
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
export declare function fmtDate(d: DateInput, style?: DateStyle, opts?: DateOptions, lang?: Lang): string;
/** 24-hour time, «10:00», midnight «00:00». */
export declare function fmtTime(d: DateInput, lang?: Lang): string;
/** «10:00–11:00» on one day; «Thu 12 Nov 10:00 – Fri 13 Nov 09:00» across days. */
export declare function fmtRange(a: DateInput, b: DateInput, lang?: Lang): string;
/**
 * Relative to now: «now», «in 38 min», «12 min ago», «Today», «Yesterday», «Tomorrow», else a short date.
 * Greek: «τώρα», «σε 38′», «πριν 12′», «Σήμερα», «Χθες», «Αύριο».
 */
export declare function fmtRelative(d: DateInput, now?: DateInput, lang?: Lang): string;
/** «€1,234.50» · «1.234,50 €» (the space before € is the non-breaking one Intl gives). */
export declare function fmtMoney(amount: number, currency?: string, lang?: Lang): string;
/** A number as the language writes it: 1,234.5 · 1.234,5. `digits` fixes the decimals. */
export declare function num(value: number | string | null | undefined, digits?: number, lang?: Lang): string;
export type Forms = readonly [one: string, other: string];
/**
 * A count with its word: plural(1, ['change', 'changes'], ['αλλαγή', 'αλλαγές']) → «1 change» · «1 αλλαγή»;
 * plural(3, …) → «3 changes» · «3 αλλαγές»; 0 takes the plural in both languages. `bare` leaves the number out.
 */
export declare function plural(n: number, en: Forms, el: Forms, bare?: boolean, lang?: Lang): string;
/**
 * The word that agrees with a count, for verbs and adjectives: verb(3, 'Sent', ['Στάλθηκε', 'Στάλθηκαν']) → «Sent» ·
 * «Στάλθηκαν». English may pass one form when it does not change.
 */
export declare function verb(n: number, en: string | Forms, el: Forms, lang?: Lang): string;
export {};
