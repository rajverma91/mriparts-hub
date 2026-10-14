import Link from 'next/link';
import SaveButton from './SaveButton';
import { firstImage } from '@/lib/parseGallery';

export default function ListingCard({ item }) {
  const img = firstImage(item) || 'https://via.placeholder.com/400x300?text=Medical+Equipment';
  const href = `/listings/${item.slug || item.id}`;

  const isFeatured = Boolean(item.is_featured)
    && Boolean(item.featured_until)
    && new Date(item.featured_until) > new Date();

  return (
    <div className="card listing-card" style={{ position: 'relative' }}>
      {isFeatured && (
        <span
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            padding: '3px 9px',
            borderRadius: 6,
            letterSpacing: 0.5,
            zIndex: 3
          }}
        >
          ⭐ FEATURED
        </span>
      )}
{item.advert_type && item.advert_type !== 'sell' && (
  <span style={{
    position: 'absolute', top: 8, left: isFeatured ? 130 : 8,
    background: item.advert_type === 'buy' ? '#0ea5e9' : '#a855f7',
    color: '#fff', fontSize: 11, fontWeight: 700,
    padding: '3px 9px', borderRadius: 6, letterSpacing: 0.5, zIndex: 3
  }}>
    {item.advert_type === 'buy' ? 'BUY' : 'AUCTION'}
  </span>
)}
      <SaveButton listingId={item.id} variant="overlay" />

      <Link href={href}>
        <img src={img} alt={item.title} />
        <div className="body">
          {item.category && <span className="badge">{item.category}</span>}
          <h3 style={{ marginTop: 8 }}>{item.title}</h3>
          <div className="meta">
            {item.brand && <>{item.brand} · </>}
            {item.country || '—'}
          </div>
          <div className="price">
            {item.currency} {Number(item.price || 0).toLocaleString()}
          </div>
        </div>
      </Link>
    </div>
  );
}