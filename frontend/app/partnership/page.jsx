import Link from 'next/link';

export default function PartnershipPage() {
  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 820 }}>
      <h1 style={{ marginBottom: 8 }}>Service partnership</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        Partner with MRI Parts Hub to offer installation, service, or logistics
        to our global community of buyers and sellers.
      </p>

      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Who we partner with</h3>
        <ul style={{ color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
          <li>Certified biomedical engineers</li>
          <li>Equipment installation companies</li>
          <li>Freight and logistics providers</li>
          <li>Training and certification centres</li>
          <li>Parts distributors and OEMs</li>
        </ul>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Get in touch</h3>
        <p style={{ color: '#374151', lineHeight: 1.8 }}>
          Email us at <a href="mailto:partners@mripartshub.com" style={{ color: '#0d6efd' }}>partners@mripartshub.com</a>{' '}
          with a short summary of your company, the regions you cover, and the services you provide.
        </p>
        <Link href="/contacts" className="btn" style={{ marginTop: 16 }}>Contact us</Link>
      </div>
    </div>
  );
}