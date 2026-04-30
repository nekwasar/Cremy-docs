import { CONVERT_PAIRS, getCategoryLabels } from '@/config/convert-pairs';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const convertUrls: MetadataRoute.Sitemap = CONVERT_PAIRS.map((pair) => ({
    url: `https://cremydocs.com/convert/${pair.slug}`,
    lastModified: new Date(),
    changeFrequency: pair.priority >= 90 ? 'weekly' : 'monthly',
    priority: pair.priority / 100,
  }));

  const categoryUrls: MetadataRoute.Sitemap = Object.keys(getCategoryLabels()).map((category) => ({
    url: `https://cremydocs.com/convert/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://cremydocs.com/convert',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...categoryUrls,
    ...convertUrls,
  ];
}
