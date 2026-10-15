import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function ManufacturersPage() {
  const res = await fetch(`${API}/brands`, { cache: 'no-store' });
  const brands = res.ok ? await res.json() : [];

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>Manufacturers</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Browse medical equipment by manufacturer.
      </p>

      <div className="grid grid-4">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/listings?brand=${encodeURIComponent(b.name)}`}
            className="card"
            style={{ padding: 20, textAlign: 'center', display: 'block' }}
          >
            <div style={{ fontSize: 16, fontWeight: 700 }}>{b.name}</div>
            <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
              {b.count || 0} listings
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}