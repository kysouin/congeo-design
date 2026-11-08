/**
 * Date and time text independent of the device locale: ΗΗ/ΜΜ/ΕΕΕΕ and 24-hour ΩΩ:ΛΛ, parsed leniently,
 * with the day arithmetic a month grid needs. Values are ISO: YYYY-MM-DD and HH:mm. Generalised from
 * calendar's src/lib/dates-el.ts and src/lib/time.ts, which are proven in use.
 */
import { getLang } from './core.js';
import { nicosiaParts, fmtDate } from './format.js';
const pad = (n) => String(n).padStart(2, '0');
/** "2026-11-08" → "08/11/2026"; "" → "" */
export const showDate = (iso) => (iso && /^\d{4}-\d{2}-\d{2}/.test(iso) ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '');
/** "08/11/2026", "8/11/26", "08112026", "081126" → "2026-11-08"; null when it is not a real date. */
export function parseDate(text) {
    const digits = text.replace(/\D/g, '');
    let d, m, y;
    const parts = text.split(/[^\d]+/).filter(Boolean);
    if (parts.length === 3) {
        [d, m, y] = parts.map(Number);
    }
    else if (digits.length === 8 || digits.length === 6) {
        d = +digits.slice(0, 2);
        m = +digits.slice(2, 4);
        y = +digits.slice(4);
    }
    else
        return null;
    if (y < 100)
        y += 2000;
    if (!(d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100))
        return null;
    const check = new Date(Date.UTC(y, m - 1, d));
    return check.getUTCDate() === d && check.getUTCMonth() === m - 1 ? `${y}-${pad(m)}-${pad(d)}` : null;
}
/** "9", "930", "9:30", "09.30", "9h30" → "09:30"; "" → ""; "2400" or "9:75" → null */
export function parseTime(text) {
    const t = text.trim();
    if (!t)
        return '';
    const m = /^(\d{1,2})(?:[:.,hH]?(\d{2}))?$/.exec(t);
    if (!m)
        return null;
    const hh = +m[1];
    const mm = m[2] ? +m[2] : 0;
    if (hh > 23 || mm > 59)
        return null;
    return `${pad(hh)}:${pad(mm)}`;
}
/** Inserts the slashes while digits are typed: "1211" → "12/11", "12112026" → "12/11/2026". */
export function maskDate(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2)
        return digits;
    if (digits.length <= 4)
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
/** Inserts the colon once four digits are typed: "0930" → "09:30"; "930" stays until blur (→ 09:30); "9:30" stays. */
export function maskTime(raw) {
    if (/[:.,hH]/.test(raw))
        return raw.replace(/[.,hH]/, ':').replace(/[^\d:]/g, '').slice(0, 5);
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    return digits.length === 4 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}
/** Today in Nicosia as YYYY-MM-DD. */
export function dayOf(d = new Date()) {
    const p = nicosiaParts(d);
    return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}
export const isValidDay = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && parseDate(showDate(s)) === s;
/** YYYY-MM-DD plus n days. */
export function addDays(day, n) {
    const [y, m, d] = day.split('-').map(Number);
    const t = new Date(Date.UTC(y, m - 1, d + n));
    return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}
/** YYYY-MM plus n months. */
export function addMonths(month, n) {
    const [y, m] = month.split('-').map(Number);
    const t = new Date(Date.UTC(y, m - 1 + n, 1));
    return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}`;
}
export const monthOf = (day) => day.slice(0, 7);
export function daysInMonth(month) {
    const [y, m] = month.split('-').map(Number);
    return new Date(Date.UTC(y, m, 0)).getUTCDate();
}
/** 0 = Monday … 6 = Sunday */
export function weekdayMon(day) {
    const [y, m, d] = day.split('-').map(Number);
    return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}
/** The days a Monday-first month grid shows, whole weeks, leading and trailing days of the neighbours included. */
export function monthGrid(month) {
    const first = `${month}-01`;
    const offset = weekdayMon(first);
    const rows = Math.ceil((offset + daysInMonth(month)) / 7);
    const start = addDays(first, -offset);
    return Array.from({ length: rows * 7 }, (_, i) => addDays(start, i));
}
/** Two-letter day heads, Monday first. */
export function dayHeads(lang = getLang()) {
    return lang === 'el' ? ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
}
/** «November 2026» · «Νοέμβριος 2026» for a YYYY-MM. */
export function monthTitle(month, lang = getLang()) {
    const [y, m] = month.split('-').map(Number);
    return fmtDate(new Date(Date.UTC(y, m - 1, 15, 12)), 'month', {}, lang);
}
/** "HH:mm" options every `step` minutes (default 5). */
export function timeOptions(step = 5) {
    const out = [];
    for (let m = 0; m < 24 * 60; m += step)
        out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
    return out;
}
