export default function SellerProfileHeader({ seller }) {
  const initials = (seller.company || seller.name || '?')
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const stars = Math.round(seller.stats.rating_average);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        height: 90,
        background: 'linear-gradient(135deg,#0d6efd 0%,#0a58ca 100%)'
      }} />

      <div style={{ padding: '0 24px 24px', marginTop: -40 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{
            width: 96, height: 96, borderRadius: 16,
            background: '#fff', color: '#0d6efd',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 32,
            boxShadow: '0 4px 14px rgba(0,0,0,.1)'
          }}>
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 240, paddingBottom: 6 }}>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>
              {seller.company || seller.name}
            </h1>
            {seller.company && (
              <div style={{ color: '#6b7280', fontSize: 14 }}>{seller.name}</div>
            )}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8, fontSize: 13, color: '#374151' }}>
              {seller.country && <span>📍 {seller.country}</span>}
              <span>Member since {new Date(seller.created_at).getFullYear()}</span>
            </div>
          </div>

          {/* <div style={{ display: 'flex', gap: 8, paddingBottom: 6, flexWrap: 'wrap' }}>
            {seller.phone && (
              <a className="btn" href={`tel:${seller.phone}`}>📞 Call</a>
            )}
            <a className="btn btn-outline" href={`mailto:${seller.email}`}>✉️ Email</a>
            {seller.phone && (
              <a
                className="btn"
                href={`https://wa.me/${seller.phone.replace(/\D/g, '')}`}
                target="_blank" rel="noreferrer"
                style={{ background: '#25D366' }}
              >
                💬 WhatsApp
              </a>
            )}
          </div> */}
        </div>

        {/* Reputation + stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginTop: 24
        }}>
          <Stat label="Rating" value={
            seller.stats.reviews_count
              ? `${seller.stats.rating_average.toFixed(1)} ★`
              : '—'
          } accent="#f59e0b" />
          <Stat label="Reviews"     value={seller.stats.reviews_count} />
          <Stat label="Active ads"  value={seller.stats.active_listings} />
          <Stat label="Sold"        value={seller.stats.sold_listings} />
          <Stat label="Total views" value={seller.stats.total_views.toLocaleString()} />
        </div>

        {seller.is_verified ? (
          <div style={{ marginTop: 16 }}>
            <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>
              ✓ Verified Seller
            </span>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
              Unverified
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: '#f8fafc', borderRadius: 10, padding: '12px 14px', textAlign: 'center'
    }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent || '#111827' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, textTransform: 'uppercase', letterSpacing: .4 }}>
        {label}
      </div>
    </div>
  );
}