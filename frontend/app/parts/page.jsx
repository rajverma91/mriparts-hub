import Link from 'next/link';
import ListingCard from '@/components/ListingCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function PartsPage() {
  const res = await fetch(`${API}/listings?category=mri-parts-accessories&limit=24`, { cache: 'no-store' });
  const data = res.ok ? await res.json() : { data: [] };
  const rows = data.data || [];

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>Spare parts & accessories</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        MRI coils, patient tables, cables, RF doors and accessories from verified sellers.
      </p>

      {rows.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>
          No parts listed yet.
          <div style={{ marginTop: 12 }}>
            <Link href="/dashboard/listings/new" className="btn">List a part</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-4">
          {rows.map((item) => <ListingCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
