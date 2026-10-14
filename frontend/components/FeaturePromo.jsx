'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function FeaturePromo({ listingId }) {
  const [busy, setBusy]       = useState(false);
  const [listing, setListing] = useState(null);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(`/listings/${listingId}`);
        setListing(r);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [listingId]);

  async function go() {
    setBusy(true);
    setError('');
    try {
      const r = await api.post(`/payments/feature/${listingId}`, {});
      if (r.url) window.location.href = r.url;
      else setError('Could not create checkout session');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!listing) return null;

  if (listing.status !== 'active') {
    return (
      <div className="feature-banner" style={{ marginTop: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: '#92400e', fontSize: 16 }}>
            ⭐ Feature this listing
          </div>
          <div style={{ color: '#78350f', fontSize: 13, marginTop: 2 }}>
            Only active listings can be featured. Approve this listing first.
          </div>
        </div>
      </div>
    );
  }

  const isFeatured = listing.is_featured
    && listing.featured_until
    && new Date(listing.featured_until) > new Date();

  if (isFeatured) {
    return (
      <div className="feature-banner" style={{ marginTop: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: '#92400e', fontSize: 16 }}>
            ⭐ This listing is FEATURED
          </div>
          <div style={{ color: '#78350f', fontSize: 13, marginTop: 2 }}>
            Featured until {new Date(listing.featured_until).toLocaleDateString()}
          </div>
        </div>
        {error && <div className="alert error" style={{ margin: 0 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div className="feature-banner" style={{ marginTop: 16 }}>
      <div>
        <div style={{ fontWeight: 700, color: '#92400e', fontSize: 16 }}>
          ⭐ Feature this listing
        </div>
        <div style={{ color: '#78350f', fontSize: 13, marginTop: 2 }}>
          Appear at the top of search results and on the homepage for 30 days.
        </div>
        {error && <div className="alert error" style={{ marginTop: 8 }}>{error}</div>}
      </div>
      <button className="btn feature-btn" onClick={go} disabled={busy}>
        {busy ? 'Redirecting…' : 'Feature for $49 →'}
      </button>
    </div>
  );
}