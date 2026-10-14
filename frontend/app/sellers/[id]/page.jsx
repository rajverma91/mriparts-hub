import Link from 'next/link';
import SellerProfileHeader from '@/components/SellerProfileHeader';
import SellerReviewCard    from '@/components/SellerReviewCard';
import ListingCard         from '@/components/ListingCard';


const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJson(path) {
  try {
    const r = await fetch(`${API}${path}`, { cache: 'no-store' });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

export default async function SellerProfile({ params }) {
  const id = Number(params.id);
  if (!id) return <div className="container" style={{ padding: 60 }}><h1>Seller not found</h1></div>;

  const [seller, listings, reviewData] = await Promise.all([
    fetchJson(`/sellers/${id}`),
    fetchJson(`/sellers/${id}/listings?limit=12`),
    fetchJson(`/sellers/${id}/reviews`)
  ]);

  if (!seller) {
    return (
      <div className="container" style={{ padding: 60 }}>
        <h1>Seller not found</h1>
        <Link href="/listings" className="btn" style={{ marginTop: 12 }}>Back to listings</Link>
      </div>
    );
  }

  const items    = listings?.data || [];
  const reviews  = reviewData?.reviews || [];
  const stats    = reviewData?.stats || { count: 0, average: 0 };

  return (
    <div className="container" style={{ padding: '24px 20px 60px' }}>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        <Link href="/" style={{ color: '#0d6efd' }}>Home</Link>
        <span> › </span>
        <Link href="/listings" style={{ color: '#0d6efd' }}>Sellers</Link>
        <span> › </span>
        <span>{seller.company || seller.name}</span>
      </div>

      <SellerProfileHeader seller={seller} />

      {/* Listings section */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Active listings ({listings?.total || 0})</h2>
          {listings?.pages > 1 && (
            <Link href={`/listings?seller=${id}`} className="btn btn-outline" style={{ padding: '6px 14px' }}>
              View all
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="card" style={{ padding: 24, color: '#6b7280', marginTop: 14 }}>
            This seller has no active listings right now.
          </div>
        ) : (
          <div className="grid grid-4" style={{ marginTop: 16 }}>
            {items.map((it) => <ListingCard key={it.id} item={it} />)}
          </div>
        )}
      </section>

      {/* Reviews section */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Reviews ({stats.count})</h2>
          {stats.count > 0 && (
            <span style={{ color: '#f59e0b', fontSize: 20, letterSpacing: 1 }}>
              {'★'.repeat(Math.round(stats.average))}{'☆'.repeat(5 - Math.round(stats.average))}
              <span style={{ color: '#6b7280', fontSize: 14, marginLeft: 8 }}>
                {stats.average.toFixed(1)} / 5
              </span>
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="card" style={{ padding: 24, color: '#6b7280', marginTop: 14 }}>
            No reviews yet.
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            {reviews.map((r) => <SellerReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}