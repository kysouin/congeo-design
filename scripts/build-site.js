#!/usr/bin/env node
'use strict';
// Builds site/index.html from dist/: every token, every component (light and dark), the contrast table.
// Deterministic output. Fonts are copied from @fontsource into site/fonts/ (not committed).
const fs = require('fs');
const path = require('path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { checkContrast, formatMarkdown } = require('./lib/contrast-check');

const root = path.resolve(__dirname, '..');
const tokens = JSON.parse(fs.readFileSync(path.join(root, 'tokens/tokens.json'), 'utf8'));
const C = require(path.join(root, 'dist/react'));
const I18N = require(path.join(root, 'dist/i18n'));
const h = React.createElement;

// ---------- fonts ----------
function copyFonts() {
  const subsets = /-(greek|greek-ext|latin|latin-ext)-\d{3}-normal\.woff2?$/;
  const out = path.join(root, 'site/fonts');
  fs.rmSync(out, { recursive: true, force: true });
  const imports = [];
  const pkgs = [
    ['inter', tokens.font.sansWeights],
    ['jetbrains-mono', tokens.font.monoWeights],
  ];
  for (const [pkg, weights] of pkgs) {
    const src = path.join(root, 'node_modules/@fontsource', pkg);
    fs.mkdirSync(path.join(out, pkg, 'files'), { recursive: true });
    for (const w of weights) {
      const css = fs.readFileSync(path.join(src, `${w}.css`), 'utf8');
      // keep only the subsets we ship
      const blocks = css.split(/\n(?=\/\* )/).filter((b) => /greek|latin/.test(b) && !/cyrillic|vietnamese/.test(b));
      fs.writeFileSync(path.join(out, pkg, `${w}.css`), blocks.join('\n') + '\n');
      imports.push(`@import "./fonts/${pkg}/${w}.css";`);
    }
    for (const f of fs.readdirSync(path.join(src, 'files')).sort()) {
      if (subsets.test(f) && weights.some((w) => f.includes(`-${w}-`))) fs.copyFileSync(path.join(src, 'files', f), path.join(out, pkg, 'files', f));
    }
  }
  fs.writeFileSync(path.join(root, 'site/fonts.css'), '/* Generated: local copy of dist/fonts.css for the reference page. */\n' + imports.join('\n') + '\n');
}

// ---------- helpers ----------
const Icon = ({ d, size = 24 }) =>
  h('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, ...d.map((p, i) => h('path', { key: i, d: p })));
const ICONS = {
  calendar: ['M8 2v4M16 2v4M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  list: ['M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'],
  folder: ['M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z'],
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  plus: ['M5 12h14M12 5v14'],
  inbox: ['M22 12h-6l-2 3h-4l-2-3H2', 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  chevron: ['m9 18 6-6-6-6'],
};

const Section = ({ id, title, children, note }) =>
  h('section', { id, className: 'ref-section' }, h('h2', { className: 'cg-h24' }, title), note && h('p', { className: 'ref-note cg-small cg-ink-2' }, note), children);
const Demo = ({ title, children, id }) => h('div', { className: 'ref-demo', id }, h('div', { className: 'cg-cap ref-demo__title' }, title), h('div', { className: 'ref-demo__body' }, children));

function Swatch({ name, value }) {
  return h('div', { className: 'ref-swatch' }, h('span', { className: 'ref-swatch__chip', style: { background: value } }), h('span', { className: 'ref-swatch__name' }, name), h('span', { className: 'ref-swatch__value cg-mono' }, value));
}

// ---------- tokens ----------
function TokensSection() {
  const names = Object.keys(tokens.color.light);
  return h(
    Section,
    { id: 'tokens', title: 'Tokens', note: 'Κάθε τιμή προέρχεται από tokens/tokens.json. Every value comes from tokens/tokens.json.' },
    h('h3', { className: 'cg-h17' }, 'Χρώματα · Colours'),
    h(
      'div',
      { className: 'ref-two' },
      ['light', 'dark'].map((scheme) =>
        h(
          'div',
          { key: scheme, className: 'ref-panel', 'data-theme': scheme },
          h('div', { className: 'cg-cap' }, scheme),
          h('div', { className: 'ref-swatches' }, names.map((n) => h(Swatch, { key: n, name: n, value: tokens.color[scheme][n] }))),
        ),
      ),
    ),
    h('h3', { className: 'cg-h17' }, 'Τυπογραφία · Type'),
    h(
      'div',
      { className: 'ref-type' },
      Object.entries(tokens.font.size).map(([k, v]) =>
        h('div', { key: k, className: 'ref-type__row' }, h('span', { className: 'cg-mono cg-ink-3 ref-type__key' }, `${v.px}/${v.line}`), h('span', { style: { fontSize: `var(--cg-size-${k})`, lineHeight: `var(--cg-line-${k})`, fontWeight: k === '30' ? 700 : Number(k) >= 17 ? 600 : 400, letterSpacing: k === '30' ? 'var(--cg-title-tracking)' : undefined } }, `${v.use} — Εβδομάδα 0637`)),
      ),
      h('div', { className: 'ref-type__row' }, h('span', { className: 'cg-mono cg-ink-3 ref-type__key' }, 'caps'), h('span', { className: 'cg-cap' }, 'Εβδομάδα · Πρόταση · Έγινε')),
      h('div', { className: 'ref-type__row' }, h('span', { className: 'cg-mono cg-ink-3 ref-type__key' }, 'mono'), h('span', { className: 'cg-mono' }, '0637 · 14:30 · 1 234,50 €')),
      h('p', { className: 'cg-small cg-ink-2' }, `Inter ${tokens.font.sansWeights.join('/')} · JetBrains Mono ${tokens.font.monoWeights.join('/')} with tnum · self-hosted via @fontsource`),
    ),
    h('h3', { className: 'cg-h17' }, 'Αποστάσεις · Spacing'),
    h('div', { className: 'ref-bars' }, Object.entries(tokens.space).map(([k, v]) => h('div', { key: k, className: 'ref-bar' }, h('span', { className: 'ref-bar__fill', style: { width: v } }), h('span', { className: 'cg-mono cg-xsmall cg-ink-2' }, `space-${k} = ${v}`)))),
    h('h3', { className: 'cg-h17' }, 'Γωνίες · Radius'),
    h('div', { className: 'ref-radii' }, Object.entries(tokens.radius).map(([k, v]) => h('div', { key: k, className: 'ref-radius' }, h('span', { className: 'ref-radius__box', style: { borderRadius: v } }), h('span', { className: 'cg-mono cg-xsmall cg-ink-2' }, `${k} ${v === 999 ? 'pill' : v}`)))),
    h('h3', { className: 'cg-h17' }, 'Σκιές · Shadows'),
    h(
      'div',
      { className: 'ref-two' },
      ['light', 'dark'].map((scheme) =>
        h('div', { key: scheme, className: 'ref-panel', 'data-theme': scheme }, h('div', { className: 'cg-cap' }, scheme), h('div', { className: 'ref-shadows' }, Object.entries(tokens.shadow[scheme]).map(([k, v]) => h('div', { key: k, className: 'ref-shadow', style: { boxShadow: `var(--cg-shadow-${k})` } }, h('span', { className: 'cg-xsmall' }, k), h('span', { className: 'cg-mono cg-xsmall cg-ink-3' }, v))))),
      ),
    ),
    h('h3', { className: 'cg-h17' }, 'Κίνηση · Motion'),
    h(
      'ul',
      { className: 'cg-small ref-list' },
      Object.entries(tokens.motion.duration).map(([k, v]) => h('li', { key: k }, h('span', { className: 'cg-mono' }, `dur-${k}`), ` ${v} ms`)),
      h('li', null, h('span', { className: 'cg-mono' }, 'ease'), ` ${tokens.motion.easing}`),
      h('li', null, h('span', { className: 'cg-mono' }, 'spring'), ` damping ${tokens.motion.spring.damping}, stiffness ${tokens.motion.spring.stiffness}`),
      h('li', null, 'prefers-reduced-motion: all transitions and animations are disabled.'),
    ),
    h('h3', { className: 'cg-h17' }, 'Εικονίδια · Icons'),
    h('p', { className: 'cg-small' }, `Lucide (${tokens.icon.packages.join(', ')}), stroke ${tokens.icon.stroke}, sizes ${tokens.icon.sizes.join(' / ')}. Not wrapped; use the library directly.`),
    h('p', { className: 'cg-small' }, `Touch target: ${tokens.touch} px minimum.`),
  );
}

// ---------- components ----------
function Showcase({ scheme }) {
  const seg = [{ value: 'w', label: 'Εβδομάδα' }, { value: 'm', label: 'Μήνας' }];
  const tabs = [
    { key: 'today', label: 'Σήμερα', icon: h(Icon, { d: ICONS.calendar }) },
    { key: 'tasks', label: 'Εργασίες', icon: h(Icon, { d: ICONS.list }) },
    { key: 'projects', label: 'Έργα', icon: h(Icon, { d: ICONS.folder }) },
    { key: 'me', label: 'Εγώ', icon: h(Icon, { d: ICONS.user }) },
  ];
  const longTitle = 'Επίσκεψη στο εργοτάξιο για έλεγχο οπλισμού πλάκας ορόφου και συνεννόηση με τον εργολάβο για το χρονοδιάγραμμα';
  const noop = () => {};
  return h(
    'div',
    { className: 'ref-panel ref-showcase', 'data-theme': scheme, id: `showcase-${scheme}` },
    h('div', { className: 'cg-cap' }, scheme),

    h(Demo, { title: 'Button' }, h('div', { className: 'cg-cluster' }, h(C.Button, { variant: 'primary' }, 'Αποθήκευση'), h(C.Button, { variant: 'secondary' }, 'Ακύρωση'), h(C.Button, { variant: 'ghost' }, 'Περισσότερα'), h(C.Button, { variant: 'danger' }, 'Διαγραφή')), h('div', { className: 'cg-cluster' }, h(C.Button, { variant: 'primary', size: 'sm' }, 'Primary sm'), h(C.Button, { variant: 'secondary', size: 'sm' }, 'Secondary sm'), h(C.Button, { variant: 'ghost', size: 'sm' }, 'Ghost sm'), h(C.Button, { variant: 'danger', size: 'sm' }, 'Danger sm'), h(C.Button, { variant: 'primary', disabled: true }, 'Disabled')), h('div', { className: 'cg-cluster' }, h(C.IconButton, { variant: 'primary', label: 'Προσθήκη' }, h(Icon, { d: ICONS.plus })), h(C.IconButton, { variant: 'secondary', label: 'Λίστα' }, h(Icon, { d: ICONS.list })), h(C.IconButton, { variant: 'ghost', label: 'Ημερολόγιο' }, h(Icon, { d: ICONS.calendar })))),

    h(Demo, { title: 'ProjectChip' }, h('div', { className: 'cg-cluster' }, h(C.ProjectChip, { number: '0637' }), h(C.ProjectChip, { number: '0712' }), h(C.ProjectChip, { number: '0637', accent: { tool: 'rhoi' } }), h(C.ProjectChip, { number: '0637', accent: { tool: 'trace' } }), h(C.ProjectChip, { number: '0637', accent: { status: 'proposal' } }))),

    h(Demo, { title: 'ToolMark' }, h('div', { className: 'cg-cluster' }, ['kaneto', 'rhoi', 'trace', 'permitflow', 'internal'].map((t) => h(C.ToolMark, { key: t, tool: t }))), h('div', { className: 'cg-cluster' }, h(C.ToolMark, { tool: 'internal', label: 'Ημερολόγιο', size: 'lg' }), h(C.ToolMark, { tool: 'internal', label: 'Τιμολόγηση', size: 'lg' }), h(C.ToolMark, { tool: 'internal', label: 'PDF', size: 'lg' }))),

    h(Demo, { title: 'Card' }, h('div', { className: 'cg-stack' }, h(C.Card, { title: 'Κάρτα' }, h('p', { className: 'cg-small cg-ink-2', style: { margin: 0 } }, 'Surface, radius 14, shadow card, 1px line-soft.')), h(C.Card, { size: 'lg', raised: true, title: 'Μεγάλη κάρτα (raised)' }, h('p', { className: 'cg-small cg-ink-2', style: { margin: 0 } }, 'Radius 16, shadow raised.')), h(C.Card, { tint: { tool: 'permitflow' }, title: 'Tint PermitFlow' }, h('p', { className: 'cg-small', style: { margin: 0, color: 'var(--cg-tool-on-tint)' } }, 'Tool tint with on-tint ink.')))),

    h(Demo, { title: 'Row' }, h('div', { className: 'cg-list' }, h(C.Row, { title: longTitle, meta: [h(C.ProjectChip, { key: 'c', number: '0637' }), h('span', { key: 't', className: 'cg-mono' }, '09:30'), h(C.ToolMark, { key: 'm', tool: 'rhoi' })], accent: { tool: 'rhoi' }, pending: true, lead: h(C.CheckCircle, { checked: false, label: 'Έγινε' }), trail: h(Icon, { d: ICONS.chevron, size: 20 }) }), h(C.Row, { title: 'Παράδοση σχεδίων αδείας', meta: [h(C.ProjectChip, { key: 'c', number: '0712' }), h('span', { key: 't', className: 'cg-mono' }, 'Πέμπτη 14:00')], accent: { status: 'warn' }, lead: h(C.CheckCircle, { checked: false, overdue: true }) }), h(C.Row, { title: 'Πληρωμή εργολάβου', meta: h('span', { className: 'cg-mono' }, '1 234,50 €'), accent: { status: 'ok' }, done: true, lead: h(C.CheckCircle, { checked: true }) }), h(C.Row, { title: 'Χωρίς accent, με trailing κείμενο', meta: 'Meta line', trail: h('span', { className: 'cg-mono cg-xsmall' }, '3/12') }))),

    h(Demo, { title: 'CheckCircle' }, h('div', { className: 'cg-cluster', style: { gap: 'var(--cg-space-5)' } }, h(C.CheckCircle, { checked: false, label: 'Ανοιχτό' }), h(C.CheckCircle, { checked: false, overdue: true, label: 'Εκπρόθεσμο' }), h(C.CheckCircle, { checked: true, label: 'Έγινε' })), h('p', { className: 'cg-xsmall cg-ink-3', style: { margin: 'var(--cg-space-2) 0 0' } }, '22 px, 44 px hit area, amber when overdue.')),

    h(Demo, { title: 'Segmented control' }, h('div', { className: 'cg-stack' }, h(C.Segmented, { options: seg, value: 'w', onChange: noop, label: 'Προβολή' }), h(C.Segmented, { options: seg, value: 'm', onChange: noop, block: true, label: 'Προβολή' }))),

    h(Demo, { title: 'FilterPill' }, h(C.FilterPills, null, h(C.FilterPill, { active: true, count: 12 }, 'Όλα'), h(C.FilterPill, { dot: { tool: 'rhoi' }, count: 4 }, 'Rhoi'), h(C.FilterPill, { dot: { tool: 'trace' }, count: 3 }, 'Trace'), h(C.FilterPill, { dot: { status: 'warn' }, count: 2 }, 'Εκπρόθεσμα'), h(C.FilterPill, { dot: { status: 'proposal' }, count: 1 }, 'Προτάσεις'))),

    h(Demo, { title: 'TabBar' }, h(C.TabBar, { items: tabs, value: 'today', inline: true }), h('p', { className: 'cg-xsmall cg-ink-3', style: { margin: 'var(--cg-space-2) 0 0' } }, 'Floating, fixed to the bottom, safe-area aware. Shown inline here.')),

    h(Demo, { title: 'Sheet' }, h(C.Sheet, { open: true, inline: true, title: 'Νέα εργασία' }, h('div', { className: 'cg-stack' }, h(C.Input, { label: 'Τίτλος', placeholder: 'Τι πρέπει να γίνει;' }), h(C.Textarea, { label: 'Σημειώσεις', placeholder: 'Προαιρετικά', defaultValue: 'Μεγαλώνει με το κείμενο.\nΔεύτερη γραμμή.' }), h('div', { className: 'cg-cluster' }, h(C.Button, { variant: 'primary', block: true }, 'Προσθήκη'))))),

    h(Demo, { title: 'TitleBlock' }, h(C.TitleBlock, { number: '0637', name: 'Κατοικία Παπαδόπουλου, Λατσιά', date: '08.11.2026', sheet: 'A-03' })),

    h(Demo, { title: 'ProposalCard' }, h(C.ProposalCard, { title: 'Μετακίνηση επίσκεψης στην Πέμπτη 14:00', body: 'Ο εργολάβος δεν θα είναι διαθέσιμος την Τετάρτη. Η Πέμπτη είναι ελεύθερη.', onApprove: noop, onReject: noop })),

    h(Demo, { title: 'Toast' }, h(C.ToastRegion, { inline: true }, h(C.Toast, null, 'Αποθηκεύτηκε'), h(C.Toast, { kind: 'ok', action: { label: 'Αναίρεση', onClick: noop } }, 'Η εργασία έγινε'), h(C.Toast, { kind: 'warn' }, 'Εκτός σύνδεσης. Θα σταλεί αργότερα.'), h(C.Toast, { kind: 'err' }, 'Αποτυχία αποστολής'))),

    h(Demo, { title: 'StatusBar' }, h('div', { className: 'cg-stack' }, h(C.StatusBar, { state: 'offline', count: 3 }), h(C.StatusBar, { state: 'sending', count: 2 }), h(C.StatusBar, { state: 'failed', count: 1 }))),

    h(Demo, { title: 'Input · Textarea' }, h('div', { className: 'cg-stack' }, h(C.Input, { label: 'Όνομα έργου', placeholder: 'π.χ. Κατοικία Λατσιά', hint: 'Όπως στο συμβόλαιο.' }), h(C.Input, { label: 'Αριθμός έργου', mono: true, defaultValue: '0637' }), h(C.Input, { label: 'Email', defaultValue: 'george@congeo', error: 'Μη έγκυρη διεύθυνση.' }), h(C.Input, { label: 'Ανενεργό', disabled: true, defaultValue: 'Κλειδωμένο' }), h(C.Textarea, { label: 'Περιγραφή', placeholder: 'Γράψε εδώ…' }))),

    h(Demo, { title: 'Skeleton' }, h('div', { className: 'cg-stack' }, h('div', { className: 'cg-cluster' }, h(C.Skeleton, { variant: 'circle', width: 22, height: 22 }), h(C.Skeleton, { variant: 'title' })), h(C.Skeleton, { variant: 'text' }), h(C.Skeleton, { variant: 'text', width: '80%' }), h(C.Skeleton, { variant: 'row' }))),

    h(Demo, { title: 'EmptyState' }, h(C.Card, null, h(C.EmptyState, { icon: h(Icon, { d: ICONS.inbox }), title: 'Τίποτα για σήμερα', text: 'Όταν προστεθούν εργασίες θα εμφανιστούν εδώ.', action: h(C.Button, { variant: 'primary' }, 'Νέα εργασία') }))),

    h(Demo, { title: 'SwipeRow' }, h('div', { className: 'cg-list' }, h(C.SwipeRow, { onSwipeRight: noop, onSwipeLeft: noop }, h(C.Row, { title: 'Σύρε δεξιά για «Έγινε», αριστερά για «Αύριο»', meta: h(C.ProjectChip, { number: '0637' }) })), h(C.SwipeRow, { onSwipeRight: noop, onSwipeLeft: noop, preview: 'right' }, h(C.Row, { title: 'Αποκάλυψη αριστερά: Έγινε (ok)', meta: 'preview' })), h(C.SwipeRow, { onSwipeRight: noop, onSwipeLeft: noop, preview: 'left' }, h(C.Row, { title: 'Αποκάλυψη δεξιά: Αύριο (ink-2)', meta: 'preview' }))), h('p', { className: 'cg-xsmall cg-ink-3', style: { margin: 'var(--cg-space-2) 0 0' } }, 'Pointer events, touch-action: pan-y, threshold 72 px, springs back. onHaptic callback for native haptics.')),
  );
}

function ComponentsSection() {
  return I18N.inLang('el', () => h(Section, { id: 'components', title: 'Components', note: 'Κάθε component σε light και dark. Το ίδιο markup, μόνο το data-theme αλλάζει. Each component in light and dark; same markup, only data-theme changes.' }, h('div', { className: 'ref-two ref-two--components' }, h(Showcase, { scheme: 'light' }), h(Showcase, { scheme: 'dark' }))));
}

// ---------- language ----------
const SAMPLE_ISO = '2026-11-12T08:00:00Z'; // Thu 12 Nov 2026 10:00 in Nicosia
const SAMPLE_NOW_ISO = '2026-11-12T07:22:00Z'; // 09:22 the same morning
const LANG_ROWS = [
  ['fmtDate long', (I, d) => I.fmtDate(d, 'long')],
  ['fmtDate short', (I, d, now) => I.fmtDate(d, 'short', { now })],
  ['fmtDate numeric', (I, d) => I.fmtDate(d, 'numeric')],
  ['fmtDate month (heading)', (I, d) => I.fmtDate(d, 'month')],
  ['fmtDate dayMonth', (I, d) => I.fmtDate(d, 'dayMonth')],
  ['fmtTime', (I, d) => I.fmtTime(d)],
  ['fmtTime midnight', (I, d) => I.fmtTime(new Date(d.getTime() - 10 * 3600000))],
  ['fmtRange', (I, d) => I.fmtRange(d, new Date(d.getTime() + 3600000))],
  ['fmtRelative +38 min', (I, d, now) => I.fmtRelative(d, now)],
  ['fmtRelative +1 min', (I, d, now) => I.fmtRelative(new Date(now.getTime() + 60000), now)],
  ['fmtRelative today / yesterday / tomorrow', (I, d, now) => [0, -1, 1].map((k) => I.fmtRelative(new Date(d.getTime() + k * 86400000 + 8 * 3600000), now)).join(' · ')],
  ['fmtMoney', (I) => I.fmtMoney(1234.5)],
  ['num', (I) => I.num(1234.5) + ' · ' + I.num(2, 2)],
  ['plural 0 / 1 / 2 / 5', (I) => [0, 1, 2, 5].map((n) => I.plural(n, ['change', 'changes'], ['αλλαγή', 'αλλαγές'])).join(' · ')],
  ['verb (sent)', (I) => [1, 3].map((n) => I.changesSent(n)).join(' · ')],
  ['sendingChanges', (I) => [1, 3].map((n) => I.sendingChanges(n)).join(' · ')],
  ['sectionName', (I) => ['00', '01', '02', '03', '04', '05', '06'].map((c) => I.sectionName(c)).join(' · ')],
  ['t(save) · t(offline) · t(signInWithGoogle)', (I) => [I.t('save'), I.t('offline'), I.t('signInWithGoogle')].join(' · ')],
];
// the same rows, as source for the live script (functions serialised; they use only the I18N module API)
const LANG_ROWS_SRC = '[' + LANG_ROWS.map(([name, fn]) => `[${JSON.stringify(name)}, ${fn.toString()}]`).join(',\n') + ']';

function LanguageSection() {
  const d = new Date(SAMPLE_ISO);
  const now = new Date(SAMPLE_NOW_ISO);
  return h(
    Section,
    { id: 'language', title: 'Γλώσσα · Language', note: 'Αγγλικά από προεπιλογή, Ελληνικά με ένα πάτημα, μία επιλογή για όλα τα εργαλεία (cookie congeo_lang στο .congeo.cy). English by default, Greek one tap away, one choice for every tool. The table is live: it follows the switch.' },
    h('div', { className: 'cg-cluster', style: { gap: 'var(--cg-space-4)' } }, h('div', { id: 'lang-switch' }, h(C.LanguageSwitch, null)), h('span', { className: 'cg-small cg-ink-2' }, 'document.documentElement.lang = ', h('span', { id: 'lang-current', className: 'cg-mono' }, 'en'))),
    h('p', { className: 'cg-small cg-ink-2' }, h('span', { id: 'lang-caption', className: 'cg-cap', lang: 'el' }, 'Εβδομάδα · Πρόταση · Έγινε'), ' ', h('span', { className: 'cg-xsmall cg-ink-3' }, '← .cg-cap with lang="el": uppercase drops the accents whichever interface language is set')),
    h(
      'div',
      { className: 'ref-table-wrap' },
      h(
        'table',
        { className: 'ref-table cg-small', id: 'lang-table' },
        h('thead', null, h('tr', null, h('th', null, 'helper'), h('th', { id: 'lang-col-current' }, 'current'), h('th', null, 'English'), h('th', null, 'Ελληνικά'))),
        h('tbody', null, LANG_ROWS.map(([name, fn]) => h('tr', { key: name }, h('td', { className: 'cg-mono' }, name), h('td', { 'data-live': 'current' }, I18N.inLang('en', () => fn(I18N, d, now))), h('td', { 'data-live': 'en' }, I18N.inLang('en', () => fn(I18N, d, now))), h('td', { 'data-live': 'el', lang: 'el' }, I18N.inLang('el', () => fn(I18N, d, now)))))),
      ),
    ),
    h('p', { className: 'cg-xsmall cg-ink-3' }, `Sample: Thursday 12 November 2026, 10:00 Europe/Nicosia; "now" is 09:22 the same morning. Every value comes from Intl in the browser you are using.`),
    h('h3', { className: 'cg-h17' }, 'Κανόνες · Rules'),
    h(
      'ul',
      { className: 'cg-small ref-list' },
      h('li', null, 'Interface language en or el; en on a first visit whatever the browser says. One cookie for all tools; localStorage off the shared domain; never a server round trip.'),
      h('li', null, 'The interface language never changes the data contracts («Έργο: 0637 · …», «Πηγή:»), the Drive folder names («Έργα», «01 Μελέτη»), or a document already made. Documents have their own language, per project or document.'),
      h('li', null, 'Input understands both languages at any time.'),
      h('li', null, 'British English (en-GB), 24-hour, «12 Nov 2026». Correct Greek: accents, final ς, uppercase without accents through lang="el". Glossary terms only (GLOSSARY.md).'),
      h('li', null, 'PermitFlow stays Greek only: configureLang({ fixed: "el" }).'),
    ),
  );
}

// ---------- v1.2 components: both languages, both themes ----------
function NewShowcase({ scheme, lang }) {
  const noop = () => {};
  return I18N.inLang(lang, () =>
    h(
      'div',
      { className: 'ref-panel', 'data-theme': scheme, lang, id: `new-${lang}-${scheme}` },
      h('div', { className: 'cg-cap' }, `${lang} · ${scheme}`),
      h(Demo, { title: 'Select' }, h('div', { className: 'cg-stack' }, h(C.Select, { label: I18N.L('Project', 'Έργο'), defaultValue: '0637', hint: I18N.L('Native select, Lucide chevron', 'Native select, βέλος Lucide') }, h('option', { value: '0637' }, '0637 · Λατσιά'), h('option', { value: '0712' }, '0712 · Χλώρακα')), h(C.Select, { label: I18N.L('With error', 'Με σφάλμα'), error: I18N.L('Choose a project', 'Διάλεξε έργο'), defaultValue: '' }, h('option', { value: '' }, '—')), h(C.Select, { label: I18N.L('Disabled', 'Ανενεργό'), disabled: true, defaultValue: 'x' }, h('option', { value: 'x' }, '0637 · Λατσιά')))),
      h(Demo, { title: 'DateField · TimeField' }, h('div', { className: 'cg-stack' }, h(C.DateField, { label: I18N.L('Date', 'Ημερομηνία'), value: '2026-11-12', onChange: noop, today: '2026-11-12', steps: true }), h(C.DateField, { label: I18N.L('Date, invalid', 'Ημερομηνία, μη έγκυρη'), value: '', onChange: noop, error: I18N.L('Not a valid date (DD/MM/YYYY)', 'Μη έγκυρη ημερομηνία (ΗΗ/ΜΜ/ΕΕΕΕ)'), today: '2026-11-12' }), h(C.TimeField, { label: I18N.L('Time', 'Ώρα'), value: '09:30', onChange: noop }))),
      h(Demo, { title: 'DatePicker' }, h('div', { className: 'cg-card', style: { padding: 'var(--cg-space-2)' } }, h(C.DatePicker, { value: '2026-11-20', today: '2026-11-12', onPick: noop }))),
      h(Demo, { title: 'Sheet (head, close button, swipe down)' }, h(C.Sheet, { open: true, inline: true, title: I18N.L('New task', 'Νέα εργασία'), closeButton: true }, h('div', { className: 'cg-stack' }, h(C.Input, { label: I18N.L('Title', 'Τίτλος'), placeholder: I18N.L('What needs doing?', 'Τι πρέπει να γίνει;') }), h(C.Button, { variant: 'primary', block: true }, I18N.L('Add', 'Προσθήκη'))))),
      h(Demo, { title: 'StatusBar ok' }, h('div', { className: 'cg-stack' }, h(C.StatusBar, { state: 'ok', count: 3, persist: true }, I18N.changesSent(3)), h(C.StatusBar, { state: 'sending', count: 2 }, I18N.sendingChanges(2)))),
      h(Demo, { title: 'ProposalCard (Reject left, Approve right)' }, h(C.ProposalCard, { title: I18N.L('Move the visit to Thursday 14:00', 'Μετακίνηση επίσκεψης στην Πέμπτη 14:00'), body: I18N.L('The contractor is away on Wednesday.', 'Ο εργολάβος λείπει την Τετάρτη.'), onApprove: noop, onReject: noop })),
      h(Demo, { title: 'TitleBlock, 5 cells' }, h(C.TitleBlock, { number: '0637', name: I18N.L('Papadopoulos house, Latsia', 'Κατοικία Παπαδόπουλου, Λατσιά'), date: '12/11/2026', sheet: '3/12', labels: { sheet: I18N.L('Open', 'Ανοιχτά') }, extra: [{ label: I18N.L('Next', 'Επόμενο'), value: I18N.L('Thu 14:00', 'Πέμ 14:00'), mono: true }] })),
      h(Demo, { title: 'TitleBlock, 6 cells' }, h(C.TitleBlock, { number: '0712', name: I18N.L('Block of flats, Chlorakas', 'Πολυκατοικία Χλώρακα'), date: '03/11/2026', sheet: 'A-03', extra: [{ label: I18N.L('Revision', 'Αναθεώρηση'), value: '2', mono: true }, { label: I18N.L('Scale', 'Κλίμακα'), value: '1:50', mono: true }] })),
    ),
  );
}
function NewComponentsSection() {
  return h(
    Section,
    { id: 'v12', title: 'Components v1.2', note: 'Ό,τι ζήτησε η ατζέντα: Select, DateField, TimeField, DatePicker, Sheet με σύρσιμο, StatusBar ok, σειρά ProposalCard, TitleBlock 4–6 κελιών. Σε δύο γλώσσες και δύο θέματα. What calendar asked for, in both languages and both themes.' },
    h('div', { className: 'ref-two' }, h(NewShowcase, { scheme: 'light', lang: 'en' }), h(NewShowcase, { scheme: 'dark', lang: 'en' }), h(NewShowcase, { scheme: 'light', lang: 'el' }), h(NewShowcase, { scheme: 'dark', lang: 'el' })),
  );
}

// ---------- contrast ----------
function ContrastSection() {
  const { rows, failures } = checkContrast(tokens);
  return h(
    Section,
    { id: 'contrast', title: 'Contrast', note: `WCAG AA: 4.5 για κείμενο, 3.0 για μεγάλο κείμενο και UI marks. ${rows.length} ζεύγη, ${failures.length} αποτυχίες. / ${rows.length} pairs, ${failures.length} failures.` },
    h(
      'div',
      { className: 'ref-table-wrap' },
      h(
        'table',
        { className: 'ref-table cg-small' },
        h('thead', null, h('tr', null, ['scheme', 'sample', 'fg', 'bg', 'level', 'min', 'ratio', 'result'].map((t) => h('th', { key: t }, t)))),
        h(
          'tbody',
          null,
          rows.map((r, i) =>
            h(
              'tr',
              { key: i, className: r.pass ? '' : 'ref-fail' },
              h('td', null, r.scheme),
              h('td', null, h('span', { className: 'ref-sample', style: { background: r.bgValue, color: r.fgValue } }, 'Αα 0637')),
              h('td', null, r.fg, ' ', h('span', { className: 'cg-mono cg-ink-3' }, r.fgValue)),
              h('td', null, r.bg, ' ', h('span', { className: 'cg-mono cg-ink-3' }, r.bgValue)),
              h('td', null, r.level),
              h('td', { className: 'cg-mono' }, r.min.toFixed(1)),
              h('td', { className: 'cg-mono' }, r.ratio.toFixed(2)),
              h('td', null, r.pass ? 'PASS' : 'FAIL'),
            ),
          ),
        ),
      ),
    ),
    h('h3', { className: 'cg-h17' }, 'Εξαιρέσεις · Exceptions'),
    h('ul', { className: 'cg-small ref-list' }, tokens.contrast.exceptions.map((e, i) => h('li', { key: i }, e))),
  );
}

// ---------- page ----------
const SITE_CSS = `
/* Reference page chrome. Uses tokens only. */
.ref-header { position: sticky; top: 0; z-index: 10; display: flex; flex-wrap: wrap; align-items: center; gap: var(--cg-space-3); padding: var(--cg-space-3) var(--cg-space-4); background: var(--cg-surface); border-bottom: 1px solid var(--cg-line-soft); }
.ref-header__title { font-weight: 700; letter-spacing: var(--cg-title-tracking); font-size: var(--cg-size-20); display: flex; align-items: center; gap: var(--cg-space-2); }
.ref-header nav { display: flex; gap: var(--cg-space-3); flex-wrap: wrap; font-size: var(--cg-size-14); }
.ref-header nav a { text-decoration: none; color: var(--cg-ink-2); }
.ref-header nav a:hover { color: var(--cg-ink); }
.ref-header .ref-spacer { flex: 1; }
.ref-main { padding: var(--cg-space-4); max-width: 1280px; margin: 0 auto; }
.ref-section { margin: var(--cg-space-8) 0; }
.ref-section > h2 { margin-bottom: var(--cg-space-2); }
.ref-section h3 { margin: var(--cg-space-6) 0 var(--cg-space-3); }
.ref-note { margin: 0 0 var(--cg-space-4); }
.ref-two { display: grid; grid-template-columns: 1fr; gap: var(--cg-space-4); }
@media (min-width: 900px) { .ref-two { grid-template-columns: 1fr 1fr; } }
.ref-panel { background: var(--cg-bg); color: var(--cg-ink); border: 1px solid var(--cg-line); border-radius: var(--cg-radius-card-lg); padding: var(--cg-space-4); min-width: 0; }
.ref-panel > .cg-cap { margin-bottom: var(--cg-space-3); }
.ref-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: var(--cg-space-2); }
.ref-swatch { display: grid; gap: 2px; font-size: var(--cg-size-12); line-height: var(--cg-line-12); min-width: 0; }
.ref-swatch__chip { display: block; height: 40px; border-radius: var(--cg-radius-chip); border: 1px solid var(--cg-line); }
.ref-swatch__name { font-weight: 600; overflow-wrap: anywhere; }
.ref-swatch__value { color: var(--cg-ink-3); }
.ref-type { display: grid; gap: var(--cg-space-3); }
.ref-type__row { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: var(--cg-space-3); align-items: baseline; }
.ref-type__row > span:last-child { overflow-wrap: anywhere; }
.ref-type__key { font-size: var(--cg-size-12); }
.ref-bars { display: grid; gap: var(--cg-space-2); }
.ref-bar { display: flex; align-items: center; gap: var(--cg-space-3); }
.ref-bar__fill { display: block; height: 12px; background: var(--cg-primary); border-radius: 2px; }
.ref-radii { display: flex; flex-wrap: wrap; gap: var(--cg-space-4); }
.ref-radius { display: grid; gap: var(--cg-space-1); justify-items: center; }
.ref-radius__box { display: block; width: 56px; height: 56px; background: var(--cg-surface); border: 1px solid var(--cg-line-strong); }
.ref-shadows { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--cg-space-4); padding: var(--cg-space-2); }
.ref-shadow { display: grid; gap: 2px; padding: var(--cg-space-3); background: var(--cg-surface); border-radius: var(--cg-radius-card); min-height: 72px; overflow-wrap: anywhere; }
.ref-list { padding-left: var(--cg-space-5); margin: 0; }
.ref-list li { margin: var(--cg-space-1) 0; }
.ref-demo { margin: var(--cg-space-5) 0 0; }
.ref-demo__title { margin-bottom: var(--cg-space-2); }
.ref-demo__body { min-width: 0; }
.ref-showcase .cg-tabbar--inline { margin: 0; }
.ref-table-wrap { overflow-x: auto; border: 1px solid var(--cg-line); border-radius: var(--cg-radius-row); }
.ref-table { border-collapse: collapse; width: 100%; min-width: 640px; }
.ref-table th, .ref-table td { text-align: left; padding: var(--cg-space-2) var(--cg-space-3); border-bottom: 1px solid var(--cg-line-soft); white-space: nowrap; }
.ref-table th { background: var(--cg-surface-2); font-size: var(--cg-size-12); text-transform: uppercase; letter-spacing: var(--cg-caps-tracking); color: var(--cg-ink-2); }
.ref-table tr:last-child td { border-bottom: 0; }
.ref-fail td { background: var(--cg-err-tint); color: var(--cg-err); font-weight: 600; }
.ref-sample { display: inline-block; padding: 2px var(--cg-space-2); border-radius: var(--cg-radius-chip); font-weight: 600; border: 1px solid var(--cg-line); }
.ref-footer { padding: var(--cg-space-8) var(--cg-space-4); text-align: center; }
`;

function Page() {
  return h(
    'html',
    { lang: 'el' },
    h(
      'head',
      null,
      h('meta', { charSet: 'utf-8' }),
      h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }),
      h('meta', { name: 'congeo-lang-domains', content: '.congeo.cy,.congeo.test' }),
      h('title', null, 'CONGEO Design — αναφορά'),
      h('script', { dangerouslySetInnerHTML: { __html: I18N.LANG_BOOT_SCRIPT } }),
      h('link', { rel: 'stylesheet', href: './fonts.css' }),
      h('link', { rel: 'stylesheet', href: '../dist/congeo.css' }),
      h('style', { dangerouslySetInnerHTML: { __html: SITE_CSS } }),
      h('script', {
        dangerouslySetInnerHTML: {
          __html: `(function(){var t=new URLSearchParams(location.search).get('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}})();`,
        },
      }),
    ),
    h(
      'body',
      null,
      h(
        'header',
        { className: 'ref-header' },
        h('div', { className: 'ref-header__title' }, h(C.ToolMark, { tool: 'internal', label: 'CONGEO Design', size: 'lg' })),
        h('nav', null, h('a', { href: '#tokens' }, 'Tokens'), h('a', { href: '#language' }, 'Language'), h('a', { href: '#v12' }, 'v1.2'), h('a', { href: '#components' }, 'Components'), h('a', { href: '#contrast' }, 'Contrast')),
        h('span', { className: 'ref-spacer' }),
        h('span', { id: 'greek-check', className: 'cg-cap', lang: 'el' }, 'Εβδομάδα · Πρόταση · Έγινε'),
        h(C.Button, { size: 'sm', variant: 'secondary', id: 'theme-toggle', onClick: undefined }, 'Light / Dark'),
      ),
      h(
        'main',
        { className: 'ref-main' },
        h('h1', { className: 'cg-title' }, 'Μία εμφάνιση για κάθε εργαλείο'),
        h('p', { className: 'cg-ink-2' }, 'One source for the look of every CONGEO tool. Built from dist/. Light and dark, 320 to 1280 px.'),
        h(TokensSection),
        h(LanguageSection),
        h(NewComponentsSection),
        h(ComponentsSection),
        h(ContrastSection),
      ),
      h('footer', { className: 'ref-footer cg-small cg-ink-3' }, '@congeo/design · generated by scripts/build-site.js'),
      h('script', {
        type: 'module',
        dangerouslySetInnerHTML: {
          __html: `import * as I from '../dist/i18n/esm/index.js';
const ROWS = ${LANG_ROWS_SRC};
const d = new Date(${JSON.stringify(SAMPLE_ISO)}), now = new Date(${JSON.stringify(SAMPLE_NOW_ISO)});
const sw = document.querySelectorAll('#lang-switch [role="radio"]');
function render() {
  const lang = I.uiLang();
  document.getElementById('lang-current').textContent = lang;
  document.getElementById('lang-col-current').textContent = lang === 'el' ? 'τρέχουσα (el)' : 'current (en)';
  sw.forEach((b, i) => { const on = (i === 0 ? 'en' : 'el') === lang; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
  const rows = document.querySelectorAll('#lang-table tbody tr');
  ROWS.forEach(([, fn], i) => {
    const tds = rows[i].querySelectorAll('td[data-live]');
    tds[0].textContent = fn(I, d, now);
    tds[0].lang = lang;
    tds[1].textContent = I.inLang('en', () => fn(I, d, now));
    tds[2].textContent = I.inLang('el', () => fn(I, d, now));
  });
}
sw.forEach((b, i) => b.addEventListener('click', () => I.setLang(i === 0 ? 'en' : 'el')));
I.onLangChange(render);
render();`,
        },
      }),
      h('script', {
        dangerouslySetInnerHTML: {
          __html: `document.getElementById('theme-toggle').addEventListener('click',function(){var r=document.documentElement;var cur=r.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');r.setAttribute('data-theme',cur==='dark'?'light':'dark');});`,
        },
      }),
    ),
  );
}

copyFonts();
const html = '<!doctype html>\n' + renderToStaticMarkup(h(Page)) + '\n';
fs.writeFileSync(path.join(root, 'site/index.html'), html);
const contrastRows = checkContrast(tokens);
fs.writeFileSync(
  path.join(root, 'site/contrast.md'),
  `# Contrast table\n\nGenerated from tokens/tokens.json by scripts/build-site.js. WCAG AA: 4.5 for text, 3.0 for large text and UI marks.\n\n${contrastRows.rows.length} pairs, ${contrastRows.failures.length} fail.\n\n${formatMarkdown(contrastRows.rows)}\n\n## Exceptions\n\n${tokens.contrast.exceptions.map((e) => `- ${e}`).join('\n')}\n`,
);
console.log(`site/index.html written (${html.length} bytes), site/contrast.md written`);
