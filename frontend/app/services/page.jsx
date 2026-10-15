import Link from 'next/link';

const SERVICES = [
  { title: 'Installation & Setup', desc: 'On-site installation and calibration of imaging equipment.' },
  { title: 'Preventive Maintenance', desc: 'Scheduled service contracts to keep machines running.' },
  { title: 'Repair & Diagnostics', desc: 'Troubleshooting, part replacement, and system diagnostics.' },
  { title: 'Refurbishment', desc: 'Full refurbishing of used equipment to like-new condition.' },
  { title: 'Training', desc: 'Operator and technician training on new systems.' },
  { title: 'Decommissioning', desc: 'Safe removal and disposal of outdated equipment.' },
  { title: 'Transport & Logistics', desc: 'Specialised crating, freight, and installation logistics.' },
  { title: 'Consulting', desc: 'Equipment selection, procurement, and lifecycle planning.' },
];

export default function ServicesPage() {
  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>Services for medical equipment</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        Professional services offered by verified vendors on MRI Parts Hub.
      </p>

      <div className="grid grid-3">
        {SERVICES.map((s) => (
          <div key={s.title} className="card" style={{ padding: 22 }}>
            <h3 style={{ marginBottom: 8 }}>{s.title}</h3>
            <p style={{ color: '#6b7280', fontSize: 14 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="feature-banner" style={{ marginTop: 40, justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Offer your services</div>
          <p style={{ color: '#6b7280', marginTop: 6 }}>
            Join MRI Parts Hub as a service partner and reach buyers worldwide.
          </p>
          <Link href="/register" className="btn" style={{ marginTop: 12 }}>Become a service partner</Link>
        </div>
      </div>
    </div>
  );
}