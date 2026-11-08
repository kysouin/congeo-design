"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOLS = exports.SECTIONS = exports.COMMON = void 0;
exports.t = t;
exports.sendingChanges = sendingChanges;
exports.changesNotSent = changesNotSent;
exports.changesSent = changesSent;
exports.sectionName = sectionName;
/**
 * The strings every tool repeats, the project sections for display, and the tool names.
 * Use: t('save') → «Save» · «Αποθήκευση». Interface language only; a document uses inLang().
 */
const core_js_1 = require("./core.js");
const format_js_1 = require("./format.js");
exports.COMMON = {
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
function t(key) {
    const [en, el] = exports.COMMON[key];
    return (0, core_js_1.L)(en, el);
}
/** «Sending 3 changes» · «Αποστολή 3 αλλαγών» (1: «Αποστολή 1 αλλαγής»). */
function sendingChanges(n) {
    return (0, core_js_1.L)(`Sending ${(0, format_js_1.plural)(n, ['change', 'changes'], ['αλλαγής', 'αλλαγών'])}`, `Αποστολή ${(0, format_js_1.plural)(n, ['change', 'changes'], ['αλλαγής', 'αλλαγών'])}`);
}
/** «3 changes not sent» · «3 αλλαγές δεν στάλθηκαν» (1: «1 αλλαγή δεν στάλθηκε»). */
function changesNotSent(n) {
    const count = (0, format_js_1.plural)(n, ['change', 'changes'], ['αλλαγή', 'αλλαγές']);
    return (0, core_js_1.L)(`${count} not sent`, `${count} ${(0, format_js_1.verb)(n, 'not sent', ['δεν στάλθηκε', 'δεν στάλθηκαν'])}`);
}
/** «3 changes sent» · «Στάλθηκαν 3 αλλαγές». */
function changesSent(n) {
    const count = (0, format_js_1.plural)(n, ['change', 'changes'], ['αλλαγή', 'αλλαγές']);
    return (0, core_js_1.L)(`${count} sent`, `${(0, format_js_1.verb)(n, 'Sent', ['Στάλθηκε', 'Στάλθηκαν'])} ${count}`);
}
exports.SECTIONS = [
    { code: '00', drive: '00 Εισερχόμενα', en: 'Incoming', el: 'Εισερχόμενα' },
    { code: '01', drive: '01 Μελέτη', en: 'Study', el: 'Μελέτη' },
    { code: '02', drive: '02 Άδεια', en: 'Permit', el: 'Άδεια' },
    { code: '03', drive: '03 Επίβλεψη', en: 'Supervision', el: 'Επίβλεψη' },
    { code: '04', drive: '04 As-built', en: 'As-built', el: 'As-built' },
    { code: '05', drive: '05 Οικονομικά', en: 'Finance', el: 'Οικονομικά' },
    { code: '06', drive: '06 Έγγραφα', en: 'Documents', el: 'Έγγραφα' },
];
/** The display name of a section in the current language, with or without its number: «01 Study» · «01 Μελέτη». */
function sectionName(code, withCode = true) {
    const s = exports.SECTIONS.find((x) => x.code === code);
    if (!s)
        return code;
    const name = (0, core_js_1.L)(s.en, s.el);
    return withCode ? `${s.code} ${name}` : name;
}
/** The tool names. They are brands and are not translated. */
exports.TOOLS = {
    kaneto: 'Kaneto',
    rhoi: 'Rhoi',
    trace: 'Trace',
    permitflow: 'PermitFlow',
    calendar: 'Ατζέντα',
    pdf: 'congeo-pdf',
    invoicing: 'Invoicing',
    congeo: 'CONGEO',
};
