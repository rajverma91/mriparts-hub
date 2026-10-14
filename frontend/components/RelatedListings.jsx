import Link from 'next/link';

export default function RelatedListings({ title, items = [], href }) {
  if (!items.length) return null;

  return (
    <section className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{title}</h2>
        {href && <Link href={href} className="btn btn-outline" style={{ padding: '6px 14px' }}>
          View all
        </Link>}
      </div>

      <div className="grid grid-4" style={{ marginTop: 16 }}>
        {items.map((it) => (
          <Link key={it.id} href={`/listings/${it.slug || it.id}`} className="card listing-card">
            <img
              src={it.image_url || 'https://via.placeholder.com/400x300?text=Equipment'}
              alt={it.title}
            />
            <div className="body">
              <h3>{it.title}</h3>
              <div className="meta">
                {it.country || '—'} · <b style={{ color: '#374151' }}>{it.condition_type}</b>
              </div>
              <div className="price">
                {it.currency} {Number(it.price || 0).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}