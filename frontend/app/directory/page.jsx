'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  'MRI Manufacturer',
  'MRI Repair Companies',
  'CT Repair and sale Companies',
  'Hospitals',
  'Imaging Centres'
];

function DirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCat = searchParams.get('category') || '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const url = currentCat 
          ? `${API}/directory?category=${encodeURIComponent(currentCat)}`
          : `${API}/directory`;
        const res = await fetch(url);
        if (res.ok) setItems(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentCat]);

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 1000 }}>
      <h1 style={{ marginBottom: 8 }}>Business Directory</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Find manufacturers, repair companies, hospitals, and imaging centers.
      </p>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
        <button
          onClick={() => router.push('/directory')}
          className={!currentCat ? 'btn' : 'btn btn-outline'}
          style={{ padding: '8px 16px', borderRadius: 999 }}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => router.push(`/directory?category=${encodeURIComponent(cat)}`)}
            className={currentCat === cat ? 'btn' : 'btn btn-outline'}
            style={{ padding: '8px 16px', borderRadius: 999 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading directory...</p>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>
          No companies found in this category.
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: 20 }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 12, color: '#0d6efd', fontWeight: 700, marginBottom: 8 }}>
                {item.category}
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 12 }}>{item.name}</h3>
              
              <div style={{ fontSize: 14, color: '#374151', display: 'grid', gap: 6 }}>
                {item.location && <div>📍 {item.location}</div>}
                {item.phone && <div>📞 {item.phone}</div>}
                {item.website && (
                  <div>
                    🌐 <a href={item.website} target="_blank" rel="noreferrer" style={{ color: '#0d6efd' }}>Visit Website</a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/" className="btn btn-outline">← Back to home</Link>
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: 40 }}>Loading...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}