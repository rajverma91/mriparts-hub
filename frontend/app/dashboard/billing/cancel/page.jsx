import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🛑</div>
        <h1 style={{ marginTop: 10 }}>Checkout cancelled</h1>
        <p style={{ color: '#6b7280', marginTop: 10 }}>
          No payment was made. You can try again from the listing edit page.
        </p>
        <Link href="/dashboard" className="btn" style={{ marginTop: 20 }}>Back to Dashboard</Link>
      </div>
    </div>
  );
}