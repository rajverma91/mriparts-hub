import Link from 'next/link';
import SaveButton from './SaveButton';
import { firstImage } from '@/lib/parseGallery';

export default function ListingRow({ item, isTop }) {
  const img = firstImage(item) || 'https://via.placeholder.com/200x150?text=Equipment';
  const company = item.seller_company || item.seller_name || 'Seller';
  const href = `/listings/${item.slug || item.id}`;

  const isFeatured = Boolean(item.is_featured)
    && Boolean(item.featured_until)
    && new Date(item.featured_until) > new Date();

  return (
    <div className="listing-row" style={{ position: 'relative' }}>
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
            zIndex: 5  
          }}
        >
          ⭐ FEATURED
        </span>
      )}

      <SaveButton listingId={item.id} variant="overlay" />

      <Link href={href} className="listing-row-img">
        <img src={img} alt={item.title} />
      </Link>

      <div className="listing-row-body">
        <div className="listing-row-head">
          {isTop && <span className="tag tag-top">TOP</span>}
          <Link href={href} className="listing-row-title">{item.title}</Link>
        </div>

        <div className="listing-row-meta">
          <span>Brand: <b>{item.brand || '—'}</b></span>
          <span>·</span>
          <span>Category: <b>{item.category || '—'}</b></span>
        </div>

        <div className="listing-row-meta">
          <span>Shipping from: <b>{item.country || '—'}</b></span>
          <span>·</span>
          <span>Condition: <b>{item.condition_type}</b></span>
        </div>

        <div className="listing-row-price">
          {item.currency} {Number(item.price || 0).toLocaleString()}
        </div>
      </div>

      <div className="listing-row-side">
        <div className="listing-row-company">{company}</div>
        <Link href={href} className="btn btn-sm">💬 Contact Seller</Link>
      </div>
    </div>
  );
}