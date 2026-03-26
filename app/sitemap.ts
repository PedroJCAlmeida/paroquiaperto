import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://paroquiaperto.vercel.app';

  const staticRoutes = [
    '',
    '/buscar',
    '/paroquias',
    '/sobre',
    '/contacto',
    '/politicas',
    '/rgpd',
    '/cookies',
    '/login',
    '/register',
    '/recuperar-palavra-passe',
  ];

  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/paroquias' || route === '/buscar' ? 0.9 : 0.6,
  }));
}
