import Link from 'next/link';

export default function DistributorsPage() {
  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>Distributors</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Authorised distributors of medical equipment by region.
      </p>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Want to be listed as a distributor?</h3>
        <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
          We're building our global distributor directory. If you are an authorised
          distributor of medical imaging equipment, contact us to be listed.
        </p>
        <Link href="/contacts" className="btn" style={{ marginTop: 12 }}>Contact us</Link>
      </div>
    </div>
  );
}