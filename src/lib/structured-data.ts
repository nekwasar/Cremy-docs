export function generateStructuredData(slug: string, sourceLabel: string, targetLabel: string) {
  const url = `https://cremydocs.com/convert/${slug}`;
  const title = `Convert ${sourceLabel} to ${targetLabel} — Free Online Converter`;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description: `Convert ${sourceLabel} files to ${targetLabel} format online for free. No registration, no watermarks, no credits needed.`,
    applicationCategory: 'Multimedia',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateBreadcrumbLD(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
