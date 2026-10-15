import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function SitemapPage() {
  const [catRes, brandRes] = await Promise.all([
    fetch(`${API}/categories`, { cache: 'no-store' }),
    fetch(`${API}/brands`, { cache: 'no-store' }),
  ]);
  const categories = catRes.ok ? await catRes.json() : [];
  const brands = brandRes.ok ? await brandRes.json() : [];

  const mainPages = [
    ['/', 'Home'],
    ['/listings', 'Browse all listings'],
    ['/catalog', 'Catalog'],
    ['/parts', 'Spare parts'],
    ['/services', 'Services'],
    ['/sellers', 'Sellers'],
    ['/manufacturers', 'Manufacturers'],
    ['/pro-account', 'Pro accounts'],
    ['/about', 'About us'],
    ['/contacts', 'Contact'],
    ['/faq', 'FAQ'],
    ['/agreements', 'Terms'],
  ];

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 900 }}>
      <h1 style={{ marginBottom: 24 }}>Sitemap</h1>

      <section style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Main pages</h3>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2, columns: 2 }}>
          {mainPages.map(([href, label]) => (
            <li key={href}><Link href={href} style={{ color: '#0d6efd' }}>{label}</Link></li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2, columns: 2 }}>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/listings?category=${c.slug}`} style={{ color: '#0d6efd' }}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 style={{ marginBottom: 12 }}>Manufacturers</h3>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2, columns: 2 }}>
          {brands.map((b) => (
            <li key={b.id}>
              <Link href={`/listings?brand=${encodeURIComponent(b.name)}`} style={{ color: '#0d6efd' }}>{b.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}