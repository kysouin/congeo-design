// The real-browser harness: every component mounted with React running, driven by Playwright.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button, IconButton, Row, ProjectChip, SwipeRow, Sheet, Segmented, Textarea, Input, DateField, TimeField, Select, StatusBar, ProposalCard, TitleBlock, LanguageSwitch, CheckCircle,
  Dialog, Switch, RadioList, Progress,
} from '../../src/react';
import { setLang, L, uiLang } from '../../src/i18n';

declare global {
  interface Window {
    __events: { name: string; args?: unknown[] }[];
  }
}
const log = (name: string, ...args: unknown[]) => window.__events.push({ name, args });

const q = new URLSearchParams(location.search);
if (q.get('lang') === 'el' || q.get('lang') === 'en') setLang(q.get('lang') as 'el' | 'en');

const Case = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section className="h-case" data-case={id} id={`case-${id}`}>
    <h2 className="cg-h17">{title}</h2>
    {children}
  </section>
);

function SwipeCase() {
  return (
    <Case id="swipe" title="SwipeRow">
      <SwipeRow onDone={() => log('done')} onLater={() => log('later')} onHaptic={(k) => log('haptic', k)}>
        <Row title={L('Site visit, reinforcement check', 'Επίσκεψη στο εργοτάξιο, έλεγχος οπλισμού')} meta={<ProjectChip number="0637" />} accent={{ tool: 'rhoi' }} lead={<CheckCircle checked={false} />} />
      </SwipeRow>
    </Case>
  );
}

function SheetCase() {
  const [open, setOpen] = React.useState(false);
  const [threshold, setThreshold] = React.useState(0.25);
  return (
    <Case id="sheet" title="Sheet">
      <div className="cg-cluster">
        <Button id="open-sheet" variant="primary" onClick={() => setOpen(true)}>{L('Open sheet', 'Άνοιγμα')}</Button>
        <Button id="open-sheet-inline" variant="secondary" onClick={() => { setThreshold(0.25); setOpen(true); }}>{L('Open (default threshold)', 'Άνοιγμα (προεπιλογή)')}</Button>
        <span id="sheet-state" className="cg-mono">{open ? 'open' : 'closed'}</span>
      </div>
      <Sheet
        open={open}
        threshold={threshold}
        title={L('New task', 'Νέα εργασία')}
        closeButton
        onClose={() => { log('sheet-close'); setOpen(false); }}
      >
        <div className="cg-stack">
          <Input id="sheet-input" label={L('Title', 'Τίτλος')} placeholder={L('What needs doing?', 'Τι πρέπει να γίνει;')} />
          <Button id="sheet-save" variant="primary" block onClick={() => setOpen(false)}>{L('Save', 'Αποθήκευση')}</Button>
        </div>
      </Sheet>
    </Case>
  );
}

function SegmentedCase() {
  const [v, setV] = React.useState<'w' | 'm' | 'y'>('w');
  return (
    <Case id="segmented" title="Segmented">
      <Segmented
        label={L('View', 'Προβολή')}
        value={v}
        onChange={(x) => { setV(x); log('seg', x); }}
        options={[{ value: 'w', label: L('Week', 'Εβδομάδα') }, { value: 'm', label: L('Month', 'Μήνας') }, { value: 'y', label: L('Year', 'Έτος') }]}
      />
      <div className="h-out cg-mono" id="seg-value">{v}</div>
    </Case>
  );
}

function TextareaCase() {
  return (
    <Case id="textarea" title="Textarea">
      <Textarea id="ta" label={L('Notes', 'Σημειώσεις')} placeholder={L('Type…', 'Γράψε…')} onSubmit={() => log('submit')} />
    </Case>
  );
}

function FieldsCase() {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [sel, setSel] = React.useState('0637');
  return (
    <Case id="fields" title="DateField · TimeField · Select">
      <div className="cg-stack">
        <DateField id="date" label={L('Date', 'Ημερομηνία')} value={date} onChange={(v) => { setDate(v); log('date', v); }} today="2026-11-12" steps />
        <div className="h-out cg-mono" id="date-value">{date}</div>
        <TimeField id="time" label={L('Time', 'Ώρα')} value={time} onChange={(v) => { setTime(v); log('time', v); }} />
        <div className="h-out cg-mono" id="time-value">{time}</div>
        <Select id="project" label={L('Project', 'Έργο')} value={sel} onChange={(e) => { setSel(e.target.value); log('select', e.target.value); }} hint={L('The project the task belongs to', 'Το έργο της εργασίας')}>
          <option value="0637">0637 · Λατσιά</option>
          <option value="0712">0712 · Χλώρακα</option>
          <option value="0720">0720 · Πάφος</option>
        </Select>
        <div className="h-out cg-mono" id="select-value">{sel}</div>
        <Select label={L('Disabled', 'Ανενεργό')} disabled defaultValue="x"><option value="x">—</option></Select>
        <Select label={L('With error', 'Με σφάλμα')} error={L('Choose a project', 'Διάλεξε έργο')} defaultValue=""><option value="">—</option></Select>
      </div>
    </Case>
  );
}

function StatusCase() {
  const [show, setShow] = React.useState<'none' | 'ok' | 'persist'>('none');
  return (
    <Case id="status" title="StatusBar ok">
      <div className="cg-cluster">
        <Button id="status-ok" onClick={() => setShow('ok')}>{L('Show ok', 'Εμφάνιση ok')}</Button>
        <Button id="status-persist" onClick={() => setShow('persist')}>{L('Show ok, keep', 'Εμφάνιση ok, μόνιμο')}</Button>
      </div>
      <div className="h-out" id="status-out">
        {show === 'ok' && <StatusBar state="ok" count={3} onHide={() => log('status-hide')} />}
        {show === 'persist' && <StatusBar state="ok" count={3} persist onHide={() => log('status-hide')} />}
      </div>
    </Case>
  );
}

function ProposalCase() {
  return (
    <Case id="proposal" title="ProposalCard">
      <ProposalCard title={L('Move the visit to Thursday 14:00', 'Μετακίνηση επίσκεψης στην Πέμπτη 14:00')} body={L('The contractor is away on Wednesday.', 'Ο εργολάβος λείπει την Τετάρτη.')} onApprove={() => log('approve')} onReject={() => log('reject')} />
    </Case>
  );
}

function TitleBlockCase() {
  return (
    <Case id="titleblock" title="TitleBlock, 5 cells">
      <TitleBlock number="0637" name={L('Papadopoulos house, Latsia', 'Κατοικία Παπαδόπουλου, Λατσιά')} date="12/11/2026" sheet="3/12" labels={{ sheet: L('Open', 'Ανοιχτά') }} extra={[{ label: L('Next', 'Επόμενο'), value: L('Thu 14:00', 'Πέμ 14:00'), mono: true }]} />
    </Case>
  );
}

function DialogCase() {
  const [open, setOpen] = React.useState(false);
  return (
    <Case id="dialog" title="Dialog">
      <Button id="open-dialog" variant="primary" onClick={() => setOpen(true)}>{L('Open dialog', 'Άνοιγμα διαλόγου')}</Button>
      <span id="dialog-state" className="cg-mono" style={{ marginLeft: 12 }}>{open ? 'open' : 'closed'}</span>
      <Dialog
        open={open}
        title={L('Split PDF', 'Διαχωρισμός PDF')}
        onClose={() => { log('dialog-close'); setOpen(false); }}
        footer={<><Button onClick={() => setOpen(false)}>{L('Cancel', 'Ακύρωση')}</Button><Button variant="primary" onClick={() => setOpen(false)}>{L('Split', 'Διαχωρισμός')}</Button></>}
      >
        <Input id="dialog-input" label={L('Pages', 'Σελίδες')} placeholder="1-3, 5" />
      </Dialog>
    </Case>
  );
}

function SwitchCase() {
  const [on, setOn] = React.useState(false);
  return (
    <Case id="switch" title="Switch">
      <Switch id="sw" checked={on} onChange={(v) => { setOn(v); log('switch', v); }} label={L('Auto capture', 'Αυτόματη λήψη')} description={L('Captures as soon as the paper is steady.', 'Τραβάει μόλις το χαρτί μείνει σταθερό.')} />
      <div className="h-out cg-mono" id="switch-value">{String(on)}</div>
    </Case>
  );
}

function RadioCase() {
  const [v, setV] = React.useState<'each' | 'ranges' | 'every'>('each');
  return (
    <Case id="radio" title="RadioList">
      <RadioList
        label={L('Split mode', 'Τρόπος διαχωρισμού')}
        value={v}
        onChange={(x) => { setV(x); log('radio', x); }}
        options={[
          { value: 'each', label: L('One file per page', 'Ένα αρχείο ανά σελίδα'), description: L('7 files', '7 αρχεία') },
          { value: 'ranges', label: L('By ranges', 'Κατά εύρη'), description: L('Type the pages', 'Γράψε τις σελίδες'), mark: <span className="cg-chip">1-3</span> },
          { value: 'every', label: L('Every N pages', 'Κάθε N σελίδες') },
        ]}
      />
      <div className="h-out cg-mono" id="radio-value">{v}</div>
    </Case>
  );
}

const Trash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>;

function IconButtonCase() {
  return (
    <Case id="iconbutton" title="IconButton 36 / 44">
      <div className="cg-cluster">
        <IconButton id="ib-md" label={L('Delete', 'Διαγραφή')}><Trash /></IconButton>
        <IconButton id="ib-sm" size="sm" variant="ghost" label={L('Delete', 'Διαγραφή')}><Trash /></IconButton>
      </div>
    </Case>
  );
}

function ProgressCase() {
  return (
    <Case id="progress" title="Progress">
      <div className="cg-stack">
        <Progress id="prog-det" value={3} max={7} label={L('Creating PDF', 'Δημιουργία PDF')} />
        <Progress id="prog-ind" label={L('Loading', 'Φόρτωση')} />
      </div>
    </Case>
  );
}

function App() {
  return (
    <>
      <header className="cg-cluster" style={{ justifyContent: 'space-between' }}>
        <h1 className="cg-h20">congeo-design harness · {uiLang()}</h1>
        <LanguageSwitch onChange={() => location.reload()} />
      </header>
      <SwipeCase />
      <SheetCase />
      <SegmentedCase />
      <TextareaCase />
      <FieldsCase />
      <StatusCase />
      <ProposalCase />
      <TitleBlockCase />
      <DialogCase />
      <SwitchCase />
      <RadioCase />
      <IconButtonCase />
      <ProgressCase />
      <div className="h-spacer" aria-hidden="true" />
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
