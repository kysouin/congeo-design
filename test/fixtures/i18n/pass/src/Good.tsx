import { L, LL, plural, t } from '@congeo/design/i18n';
import { Row } from '@congeo/design/react';

// Σχόλιο στα ελληνικά: τα σχόλια δεν μετράνε.
const CONTRACT = 'Έργο: 0637 · Μελέτη';          // a data contract line, kept as it is
const SOURCE = 'Πηγή: calendar';
const FOLDER = '01 Μελέτη';                       // Drive folder name
const tags = { appProperties: { section: 'Μελέτη' } };

export function Good({ n }: { n: number }) {
  toast(L('Saved', 'Αποθηκεύτηκε'));
  const title = L('New task', 'Νέα εργασία');
  return (
    <div>
      <button aria-label={L('Close', 'Κλείσιμο')} title={LL({ en: 'Close', el: 'Κλείσιμο' })}>{t('save')}</button>
      <input placeholder={L('Search', 'Αναζήτηση')} />
      <Row title={L('Site visit', 'Επίσκεψη στο εργοτάξιο')} meta={plural(n, ['change', 'changes'], ['αλλαγή', 'αλλαγές'])} />
      <p>{L(
        'A long string that wraps',
        'Ένα μεγάλο κείμενο που συνεχίζει στην επόμενη γραμμή'
      )}</p>
      <span>{CONTRACT} {SOURCE} {FOLDER} {title}</span>
    </div>
  );
}
declare function toast(s: string): void;
