import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJson(path) {
  try { const r = await fetch(`${API}${path}`, { cache: 'no-store' }); return r.ok ? r.json() : []; }
  catch { return []; }
}

export default async function CatalogPage() {
  const [categories, brands] = await Promise.all([
    fetchJson('/categories'),
    fetchJson('/brands'),
  ]);

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>Equipment catalog</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Browse all categories of new and used medical equipment.
      </p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16 }}>By category</h2>
        <div className="grid grid-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/listings?category=${c.slug}`}
              className="card"
              style={{ padding: 20, display: 'block' }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>
                {c.count || 0} listing{(c.count || 0) === 1 ? '' : 's'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 16 }}>By manufacturer</h2>
        <div className="grid grid-4">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/listings?brand=${encodeURIComponent(b.name)}`}
              className="card"
              style={{ padding: 16, display: 'block', textAlign: 'center' }}
            >
              <div style={{ fontWeight: 600 }}>{b.name}</div>
              <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
                {b.count || 0} listings
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
