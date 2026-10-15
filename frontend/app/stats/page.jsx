const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJson(path) {
  try { const r = await fetch(`${API}${path}`, { cache: 'no-store' }); return r.ok ? r.json() : null; }
  catch { return null; }
}

export default async function StatsPage() {
  const [listings, categories, brands] = await Promise.all([
    fetchJson('/listings?limit=1'),
    fetchJson('/categories'),
    fetchJson('/brands'),
  ]);

  const stats = [
    ['Total listings', listings?.total || 0],
    ['Categories', categories?.length || 0],
    ['Brands', brands?.length || 0],
    ['Countries served', 40],
    ['Active sellers', '500+'],
    ['Monthly visits', '120K+'],
  ];

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>Marketplace statistics</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>Live numbers from MRI Parts Hub.</p>

      <div className="grid grid-3">
        {stats.map(([label, value]) => (
          <div key={label} className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#0d6efd' }}>{value}</div>
            <div style={{ color: '#6b7280', marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}