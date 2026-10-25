import Link from 'next/link';

export default function AccessoriesPage() {
  const items = [
    { name: 'Phantoms', slug: 'phantoms' },
    { name: 'Injectors', slug: 'injectors' },
    { name: 'Cables', slug: 'cables' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>MRI / CT Accessories</h1>
      <div className="grid grid-3" style={{ marginTop: 30 }}>
        {items.map(p => (
          <Link key={p.slug} href={`/listings?category=${p.slug}`} className="card" style={{ padding: 20 }}>
            <h3>{p.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}