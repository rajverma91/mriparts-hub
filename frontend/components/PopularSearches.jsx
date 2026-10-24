import Link from 'next/link';

const SUGGESTED = [
  'MRI Machines', 'CT Scanners', 'X-Ray Systems',
  'Anesthesia Ventilators', 'Mammography Machines', 'Blood Gas Analyzers',
  'MRI Coils', 'Patient Monitors', 'Defibrillators',
  'Infusion Pumps', 'Surgical Microscopes',
];

export default function PopularSearches() {
  return (
    <section style={{ marginTop: 40 }}>
      <h3 style={{ marginBottom: 12, fontSize: 16 }}>Popular searches</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SUGGESTED.map((s) => (
          <Link
            key={s}
            href={`/listings?q=${encodeURIComponent(s)}`}
            className="chip"
          >
            {s}
          </Link>
        ))}
      </div>
    </section>
  );
}