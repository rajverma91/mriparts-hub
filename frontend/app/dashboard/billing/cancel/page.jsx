import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 64 }}>🛑</div>
        <h1 style={{ marginTop: 16 }}>Payment Cancelled</h1>
        <p style={{ color: '#6b7280', marginTop: 10 }}>
          No money was charged. You can try again anytime.
        </p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/pro-account" className="btn">View Plans</Link>
          <Link href="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}