export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smart-event-experience.vercel.app';

  // Standard static routes
  const routes = [
    '',
    '/about',
    '/features',
    '/contact',
    '/privacy',
    '/terms',
    '/login',
    '/signup',
    '/portal/student',
    '/portal/organizer',
    '/portal/staff',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
