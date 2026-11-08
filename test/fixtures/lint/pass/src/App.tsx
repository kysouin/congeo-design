import '@congeo/design/fonts.css';
import '@congeo/design/congeo.css';
import { Row, ProjectChip } from '@congeo/design/react';

const styles = { color: 'var(--cg-ink)', background: 'var(--cg-surface)' };
export function App() {
  document.querySelector('#app');
  const href = '#section-2';
  return <Row title="Δοκιμή" meta={<ProjectChip number="0637" />} style={styles} className="bg-surface text-ink" />;
}
