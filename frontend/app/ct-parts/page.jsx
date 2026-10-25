import Link from 'next/link';

export default function CtPartsPage() {
  const parts = [
    { name: 'CT Tubes', slug: 'ct-tubes' },
    { name: 'Detectors', slug: 'detectors' },
    { name: 'High Voltage Tanks', slug: 'hv-tanks' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>CT Parts</h1>
      <div className="grid grid-3" style={{ marginTop: 30 }}>
        {parts.map(p => (
          <Link key={p.slug} href={`/listings?category=${p.slug}`} className="card" style={{ padding: 20 }}>
            <h3>{p.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}