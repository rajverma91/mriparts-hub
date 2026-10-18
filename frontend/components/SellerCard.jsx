'use client';
import Link from 'next/link';

export default function SellerCard({ seller }) {
  const initials = (seller.seller_company || seller.seller_name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // The seller's user id — try several fallbacks since different API
  // endpoints expose it under different keys.
  const sellerId = seller.user_id || seller.seller_id || seller.id;

  return (
    <div className="card" style={{ padding: 20, marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>SELLER</div>
          {sellerId ? (
            <Link
              href={`/sellers/${sellerId}`}
              style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}
            >
              {seller.seller_company || seller.seller_name}
            </Link>
          ) : (
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              {seller.seller_company || seller.seller_name}
            </div>
          )}
          {seller.seller_company && (
            <div style={{ fontSize: 13, color: '#6b7280' }}>{seller.seller_name}</div>
          )}
        </div>

        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#e0e7ff',
            color: '#3730a3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 18
          }}
        >
          {initials}
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>
          ✓ Verified
        </span>
        {seller.seller_country && (
          <span style={{ fontSize: 13, color: '#374151' }}>📍 {seller.seller_country}</span>
        )}
      </div>

      {/* <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {seller.seller_phone && (
          <a className="btn" href={`tel:${seller.seller_phone}`} style={{ flex: 1, textAlign: 'center' }}>
            📞 Call Seller
          </a>
        )}
        {seller.seller_email && (
          <a
            className="btn btn-outline"
            href={`mailto:${seller.seller_email}`}
            style={{ flex: 1, textAlign: 'center' }}
          >
            ✉️ Email
          </a>
        )}
        {seller.seller_phone && (
          <a
            href={`https://wa.me/${seller.seller_phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ background: '#25D366', flexBasis: '100%', textAlign: 'center', marginTop: 4 }}
          >
            💬 Chat on WhatsApp
          </a>
        )}
      </div> */}

      {sellerId && (
        <Link
          href={`/sellers/${sellerId}`}
          style={{
            display: 'block',
            marginTop: 12,
            fontSize: 13,
            color: '#0d6efd',
            fontWeight: 600
          }}
        >
          View seller profile →
        </Link>
      )}
    </div>
  );
}