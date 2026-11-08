export function Bad() {
  toast('Αποθηκεύτηκε');
  const opts = { title: 'Νέα εργασία', message: 'Θέλεις να συνεχίσεις;' };
  return (
    <div>
      <button>Αποθήκευση</button>
      <input placeholder="Αναζήτηση" />
      <img alt="Λογότυπο" src="x.png" />
      <span aria-label='Κλείσιμο'>×</span>
      Κείμενο χωρίς L()
    </div>
  );
}
declare function toast(s: string): void;
