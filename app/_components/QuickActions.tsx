import Link from 'next/link';
import s from '@/styles/components/QuickActions.module.css';

const TOOLS = [
  { name: 'Generate', path: '/generate' },
  { name: 'Convert', path: '/convert' },
  { name: 'Translate', path: '/translate' },
  { name: 'Voice', path: '/voice' },
  { name: 'Extract Text', path: '/extract-text-from-pdf' },
  { name: 'Merge PDF', path: '/merge-pdf' },
  { name: 'Split PDF', path: '/split-pdf' },
  { name: 'Compress', path: '/compress-pdf' },
  { name: 'Change Style', path: '/change-style' },
];

export function QuickActions() {
  return (
    <section style={{padding:'var(--space-16) 0'}}>
      <h2 style={{textAlign:'center',marginBottom:'var(--space-8)'}}>All Tools</h2>
      <div className={`${s.grid} ${s.soft}`}>
        {TOOLS.map((tool) => (
          <Link key={tool.path} href={tool.path} className={s.cell}>
            <span className={s.label}>{tool.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}