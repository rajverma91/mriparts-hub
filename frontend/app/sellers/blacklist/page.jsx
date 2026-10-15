import Link from 'next/link';

export default function BlacklistPage() {
  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 800 }}>
      <h1 style={{ marginBottom: 8 }}>Sellers blacklist</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Buyers are advised to be cautious when dealing with the sellers listed below.
        These accounts have been reported for fraudulent behaviour, misrepresentation,
        or repeated violations of our agreements.
      </p>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Reported sellers</h3>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          No sellers are currently on the blacklist. This is a good sign.
        </p>
      </div>

      <div className="card" style={{ padding: 24, marginTop: 20 }}>
        <h3 style={{ marginBottom: 12 }}>How to report a seller</h3>
        <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
          If you believe a seller is engaging in fraudulent activity, send us the details at{' '}
          <a href="mailto:support@mripartshub.com" style={{ color: '#0d6efd' }}>
            support@mripartshub.com
          </a>. Include the listing URL, screenshots of the communication, and a summary of what happened.
          We review every report within 48 hours.
        </p>
      </div>

      <Link href="/" className="btn btn-outline" style={{ marginTop: 24 }}>← Back to home</Link>
    </div>
  );
}