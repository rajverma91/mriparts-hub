const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BASE = 'https://mripartshub.com';

export default async function sitemap() {
  const staticPages = [
    { url: `${BASE}/`,                lastModified: new Date(), priority: 1.0 },
    { url: `${BASE}/listings`,        lastModified: new Date(), priority: 0.9 },
    { url: `${BASE}/login`,           lastModified: new Date(), priority: 0.3 },
    { url: `${BASE}/register`,        lastModified: new Date(), priority: 0.3 }
  ];

  let listings = [];
  let categories = [];
  let sellers = [];

  try {
    const res = await fetch(`${API}/listings?limit=1000`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      listings = (data.data || []).map((l) => ({
        url: `${BASE}/listings/${l.slug || l.id}`,
        lastModified: l.created_at ? new Date(l.created_at) : new Date(),
        priority: 0.8
      }));
    }
  } catch {}

  try {
    const res = await fetch(`${API}/categories`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      categories = (data || []).map((c) => ({
        url: `${BASE}/listings?category=${c.slug}`,
        lastModified: new Date(),
        priority: 0.6
      }));
    }
  } catch {}

  // Optional: seller profiles
  // Requires a public sellers index endpoint — skip for now if you don't have one.

  return [...staticPages, ...categories, ...listings];
}