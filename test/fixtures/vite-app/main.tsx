// The app imports the language from @congeo/design/i18n and a component from @congeo/design/react.
// Both must speak the same language: the switch inside the component changes the app's L() strings.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { L, setLang, getLang, onLangChange } from '@congeo/design/i18n';
import { LanguageSwitch, ProposalCard, StatusBar } from '@congeo/design/react';

declare global {
  interface Window {
    cgApp: { setLang: typeof setLang; getLang: typeof getLang };
  }
}
window.cgApp = { setLang, getLang };

function App() {
  const [, force] = React.useState(0);
  React.useEffect(() => onLangChange(() => force((x) => x + 1)), []);
  return (
    <main className="cg-screen cg-stack">
      <h1 id="app-title" className="cg-h20">{L('Site visit', 'Επίσκεψη στο εργοτάξιο')}</h1>
      <p id="app-lang" className="cg-mono">{getLang()}</p>
      <div id="switch"><LanguageSwitch /></div>
      <ProposalCard title={L('Move the visit', 'Μετακίνηση επίσκεψης')} onApprove={() => {}} onReject={() => {}} />
      <StatusBar state="offline" count={2} />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
