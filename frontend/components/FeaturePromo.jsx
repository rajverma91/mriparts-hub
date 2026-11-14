'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import PayPalCheckout from './PayPalCheckout';

export default function FeaturePromo({ listingId }) {
  const [listing, setListing] = useState(null);
  const [error, setError]     = useState('');
  const [showPayPal, setShowPayPal] = useState(false);

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

  function handlePayPalSuccess() {
    toast.success('Payment successful! Your listing is now featured.');
    window.location.reload();
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
    <div className="feature-banner" style={{ marginTop: 16, alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: '#92400e', fontSize: 16 }}>
          ⭐ Feature this listing
        </div>
        <div style={{ color: '#78350f', fontSize: 13, marginTop: 2 }}>
          Appear at the top of search results and on the homepage for 30 days.
        </div>
        {error && <div className="alert error" style={{ marginTop: 8 }}>{error}</div>}
      </div>

      <div>
        {!showPayPal ? (
          <button 
            className="btn feature-btn" 
            onClick={() => setShowPayPal(true)}
          >
            Feature for $49 →
          </button>
        ) : (
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, minWidth: 260, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>
              Pay $49 with PayPal
            </p>
            <PayPalCheckout 
              amount={49.00} 
              listingId={listingId} 
              onSuccess={handlePayPalSuccess} 
            />
            <button 
              onClick={() => setShowPayPal(false)} 
              className="btn btn-outline" 
              style={{ width: '100%', marginTop: 10, padding: '8px 0' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}