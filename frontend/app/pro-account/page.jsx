'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      '1 active listing',
      'Email verification badge',
      'Up to 10 photos per listing',
      'Basic analytics',
      'Standard support',
    ],
    cta: 'Current plan',
    highlight: false,
  },
  {
    name: 'Featured',
    price: '$49',
    period: '/listing/month',
    features: [
      'Keep your 1 free listing',
      'Homepage placement',
      'Gold FEATURED badge',
      'Top of search results',
      'Priority in related listings',
    ],
    cta: 'Feature a listing',
    highlight: true,
  },
  {
    name: 'Pro Seller',
    price: '$199',
    period: '/month',
    features: [
      'Unlimited listings',
      'Unlimited featured listings',
      'Company logo on profile',
      'Whitelisted on seller directory',
      'Dedicated account manager',
      'Priority email & phone support',
    ],
    cta: 'Upgrade to Pro',
    highlight: false,
  },
];

export default function ProAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      // Calls the mock-upgrade endpoint we created earlier
      await api.post('/payments/mock-upgrade', {});
      alert('Success! You are now a Pro seller. You can post unlimited listings.');
      router.push('/dashboard');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 1080 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ marginBottom: 8 }}>Pro accounts</h1>
        <p style={{ color: '#6b7280', fontSize: 17 }}>
          Grow your medical equipment business with premium placement.
        </p>
      </div>

      <div className="grid grid-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className="card"
            style={{
              padding: 28,
              border: p.highlight ? '2px solid #0d6efd' : '1px solid #e5e7eb',
              position: 'relative',
            }}
          >
            {p.highlight && (
              <span
                className="badge"
                style={{ position: 'absolute', top: -10, right: 16, background: '#0d6efd', color: '#fff' }}
              >
                Most popular
              </span>
            )}
            <h3 style={{ marginBottom: 6 }}>{p.name}</h3>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0d6efd' }}>
              {p.price}
              <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}>{p.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', color: '#374151', lineHeight: 1.9 }}>
              {p.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            
            {p.name === 'Pro Seller' ? (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn btn-outline"
                style={{ display: 'block', width: '100%', textAlign: 'center', padding: '10px 20px' }}
              >
                {loading ? 'Upgrading...' : p.cta}
              </button>
            ) : (
              <Link
                href={p.name === 'Featured' ? '/dashboard' : '/register'}
                className={p.highlight ? 'btn' : 'btn btn-outline'}
                style={{ display: 'block', textAlign: 'center', padding: '10px 20px' }}
              >
                {p.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}