import Link from 'next/link';

const NEWS = [
  {
    date: '2026-10-15',
    title: 'Welcome to MRI Parts Hub',
    summary: 'We just launched. A new marketplace for medical imaging equipment — free to list, no commissions.',
  },
  {
    date: '2026-10-10',
    title: 'Featured listings now available',
    summary: 'Sellers can now feature listings on our homepage for $49/month via Stripe.',
  },
];

export default function NewsPage() {
  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 820 }}>
      <h1 style={{ marginBottom: 24 }}>Latest news</h1>

      {NEWS.map((n) => (
        <article key={n.title} className="card" style={{ padding: 22, marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            {new Date(n.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h3 style={{ marginTop: 6, marginBottom: 6 }}>{n.title}</h3>
          <p style={{ color: '#374151', lineHeight: 1.7 }}>{n.summary}</p>
        </article>
      ))}

      <Link href="/" className="btn btn-outline" style={{ marginTop: 20 }}>← Back to home</Link>
    </div>
  );
}