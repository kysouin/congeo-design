'use strict';
// The language core (storage, L, scopes) in Node with a fake document, and the formatting table: 30+ cases per language.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { root } = require('./helpers');

const I = require(path.join(root, 'dist/i18n'));
const NIC = (y, m, d, h = 0, mi = 0) => new Date(Date.UTC(y, m - 1, d, h - 2, mi)); // Nicosia is UTC+2 in winter
const NOW = NIC(2026, 11, 12, 9, 22); // Thursday 12 Nov 2026, 09:22 in Nicosia
const D = NIC(2026, 11, 12, 10, 0);

const EN = [
  ['long', () => I.fmtDate(D, 'long'), 'Thursday 12 November 2026'],
  ['short', () => I.fmtDate(D, 'short', { now: NOW }), 'Thu 12 Nov'],
  ['short, other year', () => I.fmtDate(NIC(2025, 3, 1), 'short', { now: NOW }), 'Sat 1 Mar 2025'],
  ['short, forced year', () => I.fmtDate(D, 'short', { year: true }), 'Thu 12 Nov 2026'],
  ['numeric', () => I.fmtDate(D, 'numeric'), '12/11/2026'],
  ['numeric, padded', () => I.fmtDate(NIC(2026, 1, 5), 'numeric'), '05/01/2026'],
  ['month heading', () => I.fmtDate(D, 'month'), 'November 2026'],
  ['month heading, May', () => I.fmtDate(NIC(2026, 5, 1), 'month'), 'May 2026'],
  ['day and month', () => I.fmtDate(D, 'dayMonth'), '12 November'],
  ['weekday', () => I.fmtDate(D, 'weekday'), 'Thursday'],
  ['long, 1 March', () => I.fmtDate(NIC(2026, 3, 1), 'long'), 'Sunday 1 March 2026'],
  ['time', () => I.fmtTime(D), '10:00'],
  ['time, afternoon is 24-hour', () => I.fmtTime(NIC(2026, 11, 12, 14, 5)), '14:05'],
  ['time, midnight', () => I.fmtTime(NIC(2026, 11, 12, 0, 0)), '00:00'],
  ['time, summer (UTC+3)', () => I.fmtTime(new Date(Date.UTC(2026, 6, 1, 7, 30))), '10:30'],
  ['range, same day', () => I.fmtRange(D, NIC(2026, 11, 12, 11, 0)), '10:00–11:00'],
  ['range, across days', () => I.fmtRange(D, NIC(2026, 11, 13, 9, 0)), /^Thu 12 Nov(?: 2026)? 10:00 – Fri 13 Nov(?: 2026)? 09:00$/],
  ['relative, now', () => I.fmtRelative(new Date(NOW.getTime() + 10_000), NOW), 'now'],
  ['relative, in 1 min', () => I.fmtRelative(new Date(NOW.getTime() + 60_000), NOW), 'in 1 min'],
  ['relative, in 38 min', () => I.fmtRelative(D, NOW), 'in 38 min'],
  ['relative, 12 min ago', () => I.fmtRelative(new Date(NOW.getTime() - 12 * 60_000), NOW), '12 min ago'],
  ['relative, today', () => I.fmtRelative(NIC(2026, 11, 12, 18, 0), NOW), 'Today'],
  ['relative, yesterday', () => I.fmtRelative(NIC(2026, 11, 11, 23, 59), NOW), 'Yesterday'],
  ['relative, tomorrow', () => I.fmtRelative(NIC(2026, 11, 13, 0, 0), NOW), 'Tomorrow'],
  ['relative, far', () => I.fmtRelative(NIC(2026, 11, 20, 9, 0), NOW), 'Fri 20 Nov'],
  ['money', () => I.fmtMoney(1234.5), '€1,234.50'],
  ['money, zero', () => I.fmtMoney(0), '€0.00'],
  ['money, negative', () => I.fmtMoney(-12.3), '-€12.30'],
  ['number', () => I.num(1234.5), '1,234.5'],
  ['number, fixed', () => I.num(2, 2), '2.00'],
  ['number, empty', () => I.num(null), '–'],
  ['plural 0', () => I.plural(0, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '0 changes'],
  ['plural 1', () => I.plural(1, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '1 change'],
  ['plural 2', () => I.plural(2, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '2 changes'],
  ['plural 5', () => I.plural(5, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '5 changes'],
  ['plural bare', () => I.plural(1, ['change', 'changes'], ['αλλαγή', 'αλλαγές'], true), 'change'],
  ['verb 1', () => I.verb(1, 'Sent', ['Στάλθηκε', 'Στάλθηκαν']), 'Sent'],
  ['verb 3 with forms', () => I.verb(3, ['is', 'are'], ['είναι', 'είναι']), 'are'],
  ['sent 1', () => I.changesSent(1), '1 change sent'],
  ['sent 3', () => I.changesSent(3), '3 changes sent'],
  ['not sent 0', () => I.changesNotSent(0), '0 changes not sent'],
  ['sending 2', () => I.sendingChanges(2), 'Sending 2 changes'],
  ['section', () => I.sectionName('01'), '01 Study'],
  ['section, bare', () => I.sectionName('05', false), 'Finance'],
  ['common', () => I.t('signInWithGoogle'), 'Sign in with Google'],
];

const EL = [
  ['long (genitive month)', () => I.fmtDate(D, 'long'), 'Πέμπτη 12 Νοεμβρίου 2026'],
  ['short', () => I.fmtDate(D, 'short', { now: NOW }), 'Πέμ 12 Νοε'],
  ['short, other year', () => I.fmtDate(NIC(2025, 3, 1), 'short', { now: NOW }), 'Σάβ 1 Μαρ 2025'],
  ['short, forced year', () => I.fmtDate(D, 'short', { year: true }), 'Πέμ 12 Νοε 2026'],
  ['numeric', () => I.fmtDate(D, 'numeric'), '12/11/2026'],
  ['numeric, padded', () => I.fmtDate(NIC(2026, 1, 5), 'numeric'), '05/01/2026'],
  ['month heading (nominative)', () => I.fmtDate(D, 'month'), 'Νοέμβριος 2026'],
  ['month heading, May (nominative)', () => I.fmtDate(NIC(2026, 5, 1), 'month'), 'Μάιος 2026'],
  ['month heading, August', () => I.fmtDate(NIC(2026, 8, 1), 'month'), 'Αύγουστος 2026'],
  ['day and month (genitive)', () => I.fmtDate(D, 'dayMonth'), '12 Νοεμβρίου'],
  ['day and month, May (genitive)', () => I.fmtDate(NIC(2026, 5, 3), 'dayMonth'), '3 Μαΐου'],
  ['weekday', () => I.fmtDate(D, 'weekday'), 'Πέμπτη'],
  ['long, 1 March', () => I.fmtDate(NIC(2026, 3, 1), 'long'), 'Κυριακή 1 Μαρτίου 2026'],
  ['time', () => I.fmtTime(D), '10:00'],
  ['time, afternoon is 24-hour', () => I.fmtTime(NIC(2026, 11, 12, 14, 5)), '14:05'],
  ['time, midnight', () => I.fmtTime(NIC(2026, 11, 12, 0, 0)), '00:00'],
  ['range, same day', () => I.fmtRange(D, NIC(2026, 11, 12, 11, 0)), '10:00–11:00'],
  ['range, across days', () => I.fmtRange(D, NIC(2026, 11, 13, 9, 0)), /^Πέμ 12 Νοε(?: 2026)? 10:00 – Παρ 13 Νοε(?: 2026)? 09:00$/],
  ['relative, now', () => I.fmtRelative(new Date(NOW.getTime() + 10_000), NOW), 'τώρα'],
  ['relative, in 1 min', () => I.fmtRelative(new Date(NOW.getTime() + 60_000), NOW), 'σε 1′'],
  ['relative, in 38 min', () => I.fmtRelative(D, NOW), 'σε 38′'],
  ['relative, 12 min ago', () => I.fmtRelative(new Date(NOW.getTime() - 12 * 60_000), NOW), 'πριν 12′'],
  ['relative, today', () => I.fmtRelative(NIC(2026, 11, 12, 18, 0), NOW), 'Σήμερα'],
  ['relative, yesterday', () => I.fmtRelative(NIC(2026, 11, 11, 23, 59), NOW), 'Χθες'],
  ['relative, tomorrow', () => I.fmtRelative(NIC(2026, 11, 13, 0, 0), NOW), 'Αύριο'],
  ['relative, far', () => I.fmtRelative(NIC(2026, 11, 20, 9, 0), NOW), 'Παρ 20 Νοε'],
  ['money', () => I.fmtMoney(1234.5), '1.234,50 €'],
  ['money, zero', () => I.fmtMoney(0), '0,00 €'],
  ['number', () => I.num(1234.5), '1.234,5'],
  ['number, fixed', () => I.num(2, 2), '2,00'],
  ['plural 0', () => I.plural(0, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '0 αλλαγές'],
  ['plural 1', () => I.plural(1, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '1 αλλαγή'],
  ['plural 2', () => I.plural(2, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '2 αλλαγές'],
  ['plural 5', () => I.plural(5, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '5 αλλαγές'],
  ['plural 1000 groups', () => I.plural(1000, ['change', 'changes'], ['αλλαγή', 'αλλαγές']), '1.000 αλλαγές'],
  ['verb 1', () => I.verb(1, 'Sent', ['Στάλθηκε', 'Στάλθηκαν']), 'Στάλθηκε'],
  ['verb 0', () => I.verb(0, 'Sent', ['Στάλθηκε', 'Στάλθηκαν']), 'Στάλθηκαν'],
  ['verb 2', () => I.verb(2, 'Sent', ['Στάλθηκε', 'Στάλθηκαν']), 'Στάλθηκαν'],
  ['sent 1', () => I.changesSent(1), 'Στάλθηκε 1 αλλαγή'],
  ['sent 5', () => I.changesSent(5), 'Στάλθηκαν 5 αλλαγές'],
  ['not sent 1', () => I.changesNotSent(1), '1 αλλαγή δεν στάλθηκε'],
  ['not sent 2', () => I.changesNotSent(2), '2 αλλαγές δεν στάλθηκαν'],
  ['sending 1 (genitive)', () => I.sendingChanges(1), 'Αποστολή 1 αλλαγής'],
  ['sending 3 (genitive)', () => I.sendingChanges(3), 'Αποστολή 3 αλλαγών'],
  ['section', () => I.sectionName('01'), '01 Μελέτη'],
  ['section, bare', () => I.sectionName('00', false), 'Εισερχόμενα'],
  ['common', () => I.t('signInWithGoogle'), 'Σύνδεση με Google'],
];

const nbsp = (s) => (typeof s === 'string' ? s.replace(/ /g, ' ') : s);

for (const [lang, cases] of [['en', EN], ['el', EL]]) {
  test(`format: ${cases.length} cases in ${lang}`, () => {
    assert.ok(cases.length >= 30);
    const failures = [];
    for (const [name, fn, expected] of cases) {
      const got = I.inLang(lang, fn);
      const ok = expected instanceof RegExp ? expected.test(nbsp(got)) : nbsp(got) === expected;
      if (!ok) failures.push(`${name}: got "${got}", expected "${expected}"`);
    }
    assert.deepEqual(failures, []);
  });
}

test('core: default is English, strings and scopes', () => {
  assert.equal(I.getLang(), 'en');
  assert.equal(I.uiLang(), 'en');
  assert.equal(I.L('Save', 'Αποθήκευση'), 'Save');
  assert.equal(I.LL({ en: 'A', el: 'Β' }), 'A');
  assert.equal(I.LL({ el: 'Β' }), 'Β', 'falls back to the other language');
  assert.equal(I.inLang('el', () => I.L('Save', 'Αποθήκευση')), 'Αποθήκευση');
  assert.equal(I.getLang(), 'en', 'the document scope does not leak');
  assert.equal(I.langTag('el'), 'el-GR');
  assert.equal(I.otherLang('en'), 'el');
});

test('core: setLang notifies, writes localStorage, and the unsubscribe works', () => {
  const store = new Map();
  global.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)) };
  try {
    const seen = [];
    const off = I.onLangChange((l) => seen.push(l));
    I.setLang('el');
    assert.equal(I.getLang(), 'el');
    assert.equal(store.get('congeo.lang'), 'el');
    assert.deepEqual(seen, ['el']);
    I.setLang('el');
    assert.deepEqual(seen, ['el'], 'no notification when nothing changed');
    off();
    I.setLang('en');
    assert.deepEqual(seen, ['el']);
    assert.equal(I.getLang(), 'en');
  } finally {
    delete global.localStorage;
  }
});

test('core: a fixed language (PermitFlow) ignores setLang and storage', () => {
  I.configureLang({ fixed: 'el' });
  assert.equal(I.getLang(), 'el');
  I.setLang('en');
  assert.equal(I.getLang(), 'el');
  I.configureLang({ fixed: null });
  I.setLang('en');
  assert.equal(I.getLang(), 'en');
});

test('core: the boot snippet reads the cookie first, then localStorage, else en', () => {
  const run = (cookie, stored) => {
    const doc = { cookie, documentElement: { lang: '' } };
    const fn = new Function('document', 'localStorage', I.LANG_BOOT_SCRIPT);
    fn(doc, { getItem: () => stored });
    return doc.documentElement.lang;
  };
  assert.equal(run('', null), 'en');
  assert.equal(run('a=1; congeo_lang=el', 'en'), 'el');
  assert.equal(run('', 'el'), 'el');
  assert.equal(run('congeo_lang=fr', 'xx'), 'en');
});

test('common: every string has both languages and SECTIONS cover 00–06', () => {
  for (const [k, v] of Object.entries(I.COMMON)) {
    assert.equal(v.length, 2, k);
    assert.ok(v[0] && v[1], k);
    assert.ok(!/[Ͱ-Ͽ]/.test(v[0]), `${k}: English has Greek letters`);
    assert.ok(/[Ͱ-Ͽ]/.test(v[1]) || v[1] === v[0], `${k}: Greek has none`);
  }
  assert.deepEqual(I.SECTIONS.map((s) => s.code), ['00', '01', '02', '03', '04', '05', '06']);
  assert.ok(I.SECTIONS.every((s) => s.drive.startsWith(s.code + ' ')));
  assert.equal(I.SECTIONS[1].drive, '01 Μελέτη');
  assert.equal(I.TOOLS.permitflow, 'PermitFlow');
});
