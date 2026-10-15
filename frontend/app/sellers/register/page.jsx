import Link from 'next/link';

export default function SellerRegisterPage() {
  const benefits = [
    ['🌍', 'Reach buyers worldwide', 'Your listings appear to buyers in 40+ countries.'],
    ['💸', 'No commissions', 'Keep 100% of every sale. No platform fees on standard accounts.'],
    ['⭐', 'Featured listings', 'Boost visibility on the homepage for just $49/month.'],
    ['📈', 'Analytics dashboard', 'See views, inquiries, and conversion per listing.'],
    ['🔒', 'Verified seller badge', 'Build trust with the verified badge after email confirmation.'],
    ['📱', 'Mobile friendly', 'Your listings look great on every device.'],
  ];

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 1000 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ marginBottom: 8 }}>Become a seller on MRI Parts Hub</h1>
        <p style={{ color: '#6b7280', fontSize: 17 }}>
          Join hundreds of medical equipment vendors worldwide. It's free to list.
        </p>
        <Link href="/register" className="btn" style={{ marginTop: 20, padding: '12px 28px' }}>
          Create seller account
        </Link>
      </div>

      <div className="grid grid-3">
        {benefits.map(([icon, title, desc]) => (
          <div key={title} className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
            <h3 style={{ marginBottom: 6 }}>{title}</h3>
            <p style={{ color: '#6b7280', fontSize: 14 }}>{desc}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 28, marginTop: 40 }}>
        <h2 style={{ marginBottom: 16 }}>How it works</h2>
        <ol style={{ paddingLeft: 20, color: '#374151', lineHeight: 1.9 }}>
          <li>Create your seller account (email + password)</li>
          <li>Verify your email address</li>
          <li>Post your first listing — photos, specs, price</li>
          <li>Approve from admin (usually within 1 hour)</li>
          <li>Receive inquiries from interested buyers</li>
        </ol>
      </div>
    </div>
  );
}