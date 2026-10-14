const BASE = 'https://mripartshub.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/admin',
          '/account',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-email'
        ]
      }
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE
  };
}