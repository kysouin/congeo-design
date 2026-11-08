export declare const COMMON: {
    readonly save: readonly ["Save", "Αποθήκευση"];
    readonly cancel: readonly ["Cancel", "Ακύρωση"];
    readonly delete: readonly ["Delete", "Διαγραφή"];
    readonly undo: readonly ["Undo", "Αναίρεση"];
    readonly retry: readonly ["Retry", "Δοκίμασε ξανά"];
    readonly close: readonly ["Close", "Κλείσιμο"];
    readonly back: readonly ["Back", "Πίσω"];
    readonly search: readonly ["Search", "Αναζήτηση"];
    readonly settings: readonly ["Settings", "Ρυθμίσεις"];
    readonly signInWithGoogle: readonly ["Sign in with Google", "Σύνδεση με Google"];
    readonly signOut: readonly ["Sign out", "Αποσύνδεση"];
    readonly offline: readonly ["Offline", "Εκτός σύνδεσης"];
    readonly notSent: readonly ["Not sent", "Δεν στάλθηκε"];
    readonly today: readonly ["Today", "Σήμερα"];
    readonly yesterday: readonly ["Yesterday", "Χθες"];
    readonly tomorrow: readonly ["Tomorrow", "Αύριο"];
    readonly add: readonly ["Add", "Προσθήκη"];
    readonly edit: readonly ["Edit", "Επεξεργασία"];
    readonly done: readonly ["Done", "Έγινε"];
    readonly pending: readonly ["Pending", "Εκκρεμεί"];
    readonly approve: readonly ["Approve", "Έγκριση"];
    readonly reject: readonly ["Reject", "Απόρριψη"];
    readonly proposal: readonly ["Proposal", "Πρόταση"];
    readonly project: readonly ["Project", "Έργο"];
    readonly projects: readonly ["Projects", "Έργα"];
    readonly language: readonly ["Language", "Γλώσσα"];
    readonly week: readonly ["Week", "Εβδομάδα"];
    readonly month: readonly ["Month", "Μήνας"];
    readonly loading: readonly ["Loading…", "Φόρτωση…"];
    readonly nothingHere: readonly ["Nothing here yet", "Τίποτα εδώ ακόμα"];
    readonly tryAgainLater: readonly ["Try again later", "Δοκίμασε ξανά αργότερα"];
};
export type CommonKey = keyof typeof COMMON;
/** A common string in the current language. */
export declare function t(key: CommonKey): string;
/** «Sending 3 changes» · «Αποστολή 3 αλλαγών» (1: «Αποστολή 1 αλλαγής»). */
export declare function sendingChanges(n: number): string;
/** «3 changes not sent» · «3 αλλαγές δεν στάλθηκαν» (1: «1 αλλαγή δεν στάλθηκε»). */
export declare function changesNotSent(n: number): string;
/** «3 changes sent» · «Στάλθηκαν 3 αλλαγές». */
export declare function changesSent(n: number): string;
/**
 * The project sections. `drive` is the folder name in George's Drive and never changes; tools find the folder by
 * its section tag. `en`/`el` are for display.
 */
export interface Section {
    code: '00' | '01' | '02' | '03' | '04' | '05' | '06';
    drive: string;
    en: string;
    el: string;
}
export declare const SECTIONS: readonly Section[];
/** The display name of a section in the current language, with or without its number: «01 Design» · «01 Μελέτη». */
export declare function sectionName(code: Section['code'], withCode?: boolean): string;
/** The tool names. They are brands and are not translated. */
export declare const TOOLS: {
    readonly kaneto: 'Kaneto';
    readonly rhoi: 'Rhoi';
    readonly trace: 'Trace';
    readonly permitflow: 'PermitFlow';
    readonly calendar: 'Ατζέντα';
    readonly pdf: 'congeo-pdf';
    readonly invoicing: 'Invoicing';
    readonly congeo: 'CONGEO';
};
export type ToolKey = keyof typeof TOOLS;
