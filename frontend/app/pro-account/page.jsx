'use client';
import { useState, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api, getToken } from '@/lib/api';
import PayPalCheckout from '@/components/PayPalCheckout';

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
  const [showPayPal, setShowPayPal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  async function handleStripeUpgrade() {
    setLoading(true);
    try {
      const r = await api.post('/payments/subscribe-pro', {});
      if (r.url) {
        toast.success('Redirecting to Stripe...');
        window.location.href = r.url;
      } else {
        throw new Error('Could not create checkout session');
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePayPalSuccess() {
    toast.success('Payment successful! Upgrading your account...');
    router.push('/dashboard'); 
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
              <div>
                {!isLoggedIn ? (
                  <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <p style={{ color: '#6b7280', marginBottom: 10 }}>You must be logged in to upgrade.</p>
                    <Link href="/login" className="btn" style={{ width: '100%' }}>Log In</Link>
                    
                    {/* Payment Icons */}
                    <div style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
                      <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>We Accept</p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, opacity: 0.6 }}>
                        <span style={{ fontSize: 20 }}>💳</span>
                        <span style={{ fontSize: 20 }}>🅿️</span>
                      </div>
                    </div>
                  </div>
                ) : !showPayPal ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button 
                      onClick={handleStripeUpgrade} 
                      disabled={loading} 
                      className="btn" 
                      style={{ display: 'block', width: '100%' }}
                    >
                      {loading ? 'Processing...' : 'Upgrade with Stripe'}
                    </button>
                    <button 
                      onClick={() => setShowPayPal(true)} 
                      className="btn" 
                      style={{ display: 'block', width: '100%', background: '#0070ba' }}
                    >
                      Upgrade with PayPal
                    </button>

                    {/* Payment Icons */}
                    <div style={{ marginTop: 12 }}>
                      <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5, textAlign: 'center' }}>Secure Payment Provided By</p>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                        {/* Stripe Logo (Text style) */}
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#635BFF', letterSpacing: -0.5 }}>
                          stripe
                        </span>
                        {/* PayPal Logo (Text style) */}
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#00457C', fontStyle: 'italic', letterSpacing: -0.5 }}>
                          PayPal
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
                        {/* Credit Card Icons */}
                        <div style={{ background: '#1A1F71', color: '#fff', fontSize: 8, padding: '2px 4px', borderRadius: 2, fontWeight: 'bold' }}>VISA</div>
                        <div style={{ background: '#EB001B', color: '#fff', fontSize: 8, padding: '2px 4px', borderRadius: 2, fontWeight: 'bold' }}>MC</div>
                        <div style={{ background: '#003087', color: '#fff', fontSize: 8, padding: '2px 4px', borderRadius: 2, fontWeight: 'bold' }}>AMEX</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ textAlign: 'center', marginBottom: 10, fontWeight: 600 }}>Pay with PayPal</p>
                    <PayPalCheckout 
                      amount={199.00} 
                      onSuccess={handlePayPalSuccess} 
                    />
                    <button 
                      onClick={() => setShowPayPal(false)} 
                      className="btn btn-outline" 
                      style={{ width: '100%', marginTop: 10 }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
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