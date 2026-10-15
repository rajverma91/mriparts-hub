import Link from 'next/link';

export default function AuctionsPage() {
  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>Auctions</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Bid on medical equipment from verified sellers.
      </p>

      <div
        className="card"
        style={{
          padding: 40,
          textAlign: 'center',
          background: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
        }}
      >
        <div style={{ fontSize: 56 }}>🔨</div>
        <h2 style={{ marginTop: 12 }}>Auctions launching soon</h2>
        <p style={{ color: '#6b7280', marginTop: 8, maxWidth: 500, margin: '8px auto' }}>
          We're building a real-time bidding system. In the meantime, browse
          fixed-price listings or contact sellers directly.
        </p>
        <Link href="/listings" className="btn" style={{ marginTop: 20 }}>Browse listings</Link>
      </div>
    </div>
  );
}