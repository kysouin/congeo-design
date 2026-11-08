/**
 * The strings every tool repeats, the project sections for display, and the tool names.
 * Use: t('save') → «Save» · «Αποθήκευση». Interface language only; a document uses inLang().
 */
import { L } from './core.js';
import { plural, verb } from './format.js';
export const COMMON = {
    save: ['Save', 'Αποθήκευση'],
    cancel: ['Cancel', 'Ακύρωση'],
    delete: ['Delete', 'Διαγραφή'],
    undo: ['Undo', 'Αναίρεση'],
    retry: ['Retry', 'Δοκίμασε ξανά'],
    close: ['Close', 'Κλείσιμο'],
    back: ['Back', 'Πίσω'],
    search: ['Search', 'Αναζήτηση'],
    settings: ['Settings', 'Ρυθμίσεις'],
    signInWithGoogle: ['Sign in with Google', 'Σύνδεση με Google'],
    signOut: ['Sign out', 'Αποσύνδεση'],
    offline: ['Offline', 'Εκτός σύνδεσης'],
    notSent: ['Not sent', 'Δεν στάλθηκε'],
    today: ['Today', 'Σήμερα'],
    yesterday: ['Yesterday', 'Χθες'],
    tomorrow: ['Tomorrow', 'Αύριο'],
    add: ['Add', 'Προσθήκη'],
    edit: ['Edit', 'Επεξεργασία'],
    done: ['Done', 'Έγινε'],
    pending: ['Pending', 'Εκκρεμεί'],
    approve: ['Approve', 'Έγκριση'],
    reject: ['Reject', 'Απόρριψη'],
    proposal: ['Proposal', 'Πρόταση'],
    project: ['Project', 'Έργο'],
    projects: ['Projects', 'Έργα'],
    language: ['Language', 'Γλώσσα'],
    week: ['Week', 'Εβδομάδα'],
    month: ['Month', 'Μήνας'],
    loading: ['Loading…', 'Φόρτωση…'],
    nothingHere: ['Nothing here yet', 'Τίποτα εδώ ακόμα'],
    tryAgainLater: ['Try again later', 'Δοκίμασε ξανά αργότερα'],
};
/** A common string in the current language. */
export function t(key) {
    const [en, el] = COMMON[key];
    return L(en, el);
}
/** «Sending 3 changes» · «Αποστολή 3 αλλαγών» (1: «Αποστολή 1 αλλαγής»). */
export function sendingChanges(n) {
    return L(`Sending ${plural(n, ['change', 'changes'], ['αλλαγής', 'αλλαγών'])}`, `Αποστολή ${plural(n, ['change', 'changes'], ['αλλαγής', 'αλλαγών'])}`);
}
/** «3 changes not sent» · «3 αλλαγές δεν στάλθηκαν» (1: «1 αλλαγή δεν στάλθηκε»). */
export function changesNotSent(n) {
    const count = plural(n, ['change', 'changes'], ['αλλαγή', 'αλλαγές']);
    return L(`${count} not sent`, `${count} ${verb(n, 'not sent', ['δεν στάλθηκε', 'δεν στάλθηκαν'])}`);
}
/** «3 changes sent» · «Στάλθηκαν 3 αλλαγές». */
export function changesSent(n) {
    const count = plural(n, ['change', 'changes'], ['αλλαγή', 'αλλαγές']);
    return L(`${count} sent`, `${verb(n, 'Sent', ['Στάλθηκε', 'Στάλθηκαν'])} ${count}`);
}
export const SECTIONS = [
    { code: '00', drive: '00 Εισερχόμενα', en: 'Incoming', el: 'Εισερχόμενα' },
    { code: '01', drive: '01 Μελέτη', en: 'Design', el: 'Μελέτη' },
    { code: '02', drive: '02 Άδεια', en: 'Permit', el: 'Άδεια' },
    { code: '03', drive: '03 Επίβλεψη', en: 'Supervision', el: 'Επίβλεψη' },
    { code: '04', drive: '04 As-built', en: 'As-built', el: 'As-built' },
    { code: '05', drive: '05 Οικονομικά', en: 'Finance', el: 'Οικονομικά' },
    { code: '06', drive: '06 Έγγραφα', en: 'Documents', el: 'Έγγραφα' },
];
/** The display name of a section in the current language, with or without its number: «01 Design» · «01 Μελέτη». */
export function sectionName(code, withCode = true) {
    const s = SECTIONS.find((x) => x.code === code);
    if (!s)
        return code;
    const name = L(s.en, s.el);
    return withCode ? `${s.code} ${name}` : name;
}
/**
 * The tool names. Products sold on their own (Kaneto, Rhoi, Trace, PermitFlow) are brands and are never
 * translated. The office tools have descriptive names, which follow the interface language: use toolName().
 */
export const TOOLS = {
    kaneto: { en: 'Kaneto', el: 'Kaneto' },
    rhoi: { en: 'Rhoi', el: 'Rhoi' },
    trace: { en: 'Trace', el: 'Trace' },
    permitflow: { en: 'PermitFlow', el: 'PermitFlow' },
    calendar: { en: 'Agenda', el: 'Ατζέντα' },
    pdf: { en: 'PDF', el: 'PDF' },
    scan: { en: 'Scan', el: 'Σάρωση' },
    invoicing: { en: 'Invoicing', el: 'Τιμολόγηση' },
    congeo: { en: 'CONGEO', el: 'CONGEO' },
};
/** A tool's name in the current interface language: toolName('calendar') → «Agenda» · «Ατζέντα». */
export function toolName(key) {
    const t = TOOLS[key];
    return L(t.en, t.el);
}
