import Link from 'next/link';

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
    <section>
      <h2>All Tools</h2>
      <div>
        {TOOLS.map((tool) => (
          <Link key={tool.path} href={tool.path}>
            {tool.name}
          </Link>
        ))}
      </div>
    </section>
  );
}