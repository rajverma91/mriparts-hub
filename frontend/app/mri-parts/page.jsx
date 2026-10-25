import Link from 'next/link';

export default function MriPartsPage() {
  const parts = [
    { name: 'MRI Coils', slug: 'mri-coils' },
    { name: 'Gradients', slug: 'gradients' },
    { name: 'RF Amplifiers', slug: 'rf-amplifiers' },
    { name: 'Patient Tables', slug: 'patient-tables' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>MRI Parts</h1>
      <p style={{ color: '#6b7280', marginBottom: 30 }}>Find replacement components for MRI systems.</p>
      <div className="grid grid-3">
        {parts.map(p => (
          <Link key={p.slug} href={`/listings?category=${p.slug}`} className="card" style={{ padding: 20 }}>
            <h3>{p.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}