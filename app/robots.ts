import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/convert/', '/convert'],
        disallow: ['/api/', '/admin/', '/dashboard/', '/settings/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/convert/', '/convert'],
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://cremydocs.com/sitemap.xml',
  };
}
