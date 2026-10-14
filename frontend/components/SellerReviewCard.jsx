import Link from 'next/link';

export default function SellerReviewCard({ review }) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const href = `/listings/${review.listing_slug || review.listing_id}`;

  return (
    <div className="card" style={{ padding: 18, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{review.reviewer_name}</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>
            {new Date(review.created_at).toLocaleDateString()} · on{' '}
            <Link href={href} style={{ color: '#0d6efd' }}>
              {review.listing_title}
            </Link>
          </div>
        </div>
        <span style={{ color: '#f59e0b', fontSize: 18, letterSpacing: 1 }}>{stars}</span>
      </div>
      {review.title && <h4 style={{ marginTop: 10, marginBottom: 4 }}>{review.title}</h4>}
      <p style={{ whiteSpace: 'pre-line', color: '#374151', marginTop: 6 }}>
        {review.comment}
      </p>
    </div>
  );
}