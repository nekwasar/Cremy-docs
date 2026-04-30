import { CONVERT_PAIRS, getCategoryLabels } from '@/config/convert-pairs';
import { FORMATS } from '@/config/formats';
import { PUBLIC_ROUTES } from '@/config/seo';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: `https://cremydocs.com${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: route.priority,
  }));

  const formatUrls: MetadataRoute.Sitemap = FORMATS.map((f) => ({
    url: `https://cremydocs.com/format/${f.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

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
    ...publicRoutes,
    ...formatUrls,
    ...categoryUrls,
    ...convertUrls,
  ];
}
