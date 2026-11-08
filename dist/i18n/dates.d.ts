/**
 * Date and time text independent of the device locale: ΗΗ/ΜΜ/ΕΕΕΕ and 24-hour ΩΩ:ΛΛ, parsed leniently,
 * with the day arithmetic a month grid needs. Values are ISO: YYYY-MM-DD and HH:mm. Generalised from
 * calendar's src/lib/dates-el.ts and src/lib/time.ts, which are proven in use.
 */
import { type Lang } from './core.js';
/** "2026-11-08" → "08/11/2026"; "" → "" */
export declare const showDate: (iso: string) => string;
/** "08/11/2026", "8/11/26", "08112026", "081126" → "2026-11-08"; null when it is not a real date. */
export declare function parseDate(text: string): string | null;
/** "9", "930", "9:30", "09.30", "9h30" → "09:30"; "" → ""; "2400" or "9:75" → null */
export declare function parseTime(text: string): string | null;
/** Inserts the slashes while digits are typed: "1211" → "12/11", "12112026" → "12/11/2026". */
export declare function maskDate(raw: string): string;
/** Inserts the colon once four digits are typed: "0930" → "09:30"; "930" stays until blur (→ 09:30); "9:30" stays. */
export declare function maskTime(raw: string): string;
/** Today in Nicosia as YYYY-MM-DD. */
export declare function dayOf(d?: Date): string;
export declare const isValidDay: (s: string) => boolean;
/** YYYY-MM-DD plus n days. */
export declare function addDays(day: string, n: number): string;
/** YYYY-MM plus n months. */
export declare function addMonths(month: string, n: number): string;
export declare const monthOf: (day: string) => string;
export declare function daysInMonth(month: string): number;
/** 0 = Monday … 6 = Sunday */
export declare function weekdayMon(day: string): number;
/** The days a Monday-first month grid shows, whole weeks, leading and trailing days of the neighbours included. */
export declare function monthGrid(month: string): string[];
/** Two-letter day heads, Monday first. */
export declare function dayHeads(lang?: Lang): string[];
/** «November 2026» · «Νοέμβριος 2026» for a YYYY-MM. */
export declare function monthTitle(month: string, lang?: Lang): string;
/** "HH:mm" options every `step` minutes (default 5). */
export declare function timeOptions(step?: number): string[];
