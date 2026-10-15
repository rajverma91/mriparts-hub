import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchSellers() {
  // We don't have a public "list all sellers" endpoint yet, so we approximate:
  // pull active listings and dedupe by seller.
  try {
    const r = await fetch(`${API}/listings?limit=60`, { cache: 'no-store' });
    if (!r.ok) return [];
    const d = await r.json();
    const seen = new Map();
    (d.data || []).forEach((l) => {
      if (!l.seller_name) return;
      const key = l.seller_name + '|' + (l.seller_company || '');
      if (!seen.has(key)) {
        seen.set(key, {
          name: l.seller_name,
          company: l.seller_company,
          country: l.country,
          listings: 1,
        });
      } else {
        seen.get(key).listings += 1;
      }
    });
    return Array.from(seen.values());
  } catch {
    return [];
  }
}

export default async function SellersPage() {
  const sellers = await fetchSellers();

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>Sellers directory</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        {sellers.length} verified seller{sellers.length === 1 ? '' : 's'} currently listing equipment.
      </p>

      {sellers.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>
          No sellers yet.
        </div>
      ) : (
        <div className="grid grid-3">
          {sellers.map((s, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <h3 style={{ marginBottom: 4 }}>{s.company || s.name}</h3>
              {s.company && <div style={{ color: '#6b7280', fontSize: 13 }}>{s.name}</div>}
              <div style={{ marginTop: 10, fontSize: 13, color: '#374151' }}>
                📍 {s.country || '—'} · {s.listings} listing{s.listings === 1 ? '' : 's'}
              </div>
              <Link
                href={`/listings?seller=${encodeURIComponent(s.name)}`}
                className="btn btn-outline"
                style={{ marginTop: 12, display: 'inline-block', padding: '6px 14px' }}
              >
                View listings
              </Link>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/register" className="btn">Become a seller</Link>
      </div>
    </div>
  );
}