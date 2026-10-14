'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

function Inner() {
  const sp = useSearchParams();
  const sessionId = sp.get('session_id');
  const [state, setState] = useState('loading');
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!sessionId) { setState('error'); return; }
    (async () => {
      try {
        const r = await api.get(`/payments/verify/${sessionId}`);
        setData(r);
        setState(r.payment?.status === 'paid' ? 'ok' : 'pending');
      } catch {
        setState('error');
      }
    })();
  }, [sessionId]);

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        {state === 'loading' && <h1>Verifying your payment…</h1>}

        {state === 'ok' && (
          <>
            <div style={{ fontSize: 56 }}>🎉</div>
            <h1 style={{ marginTop: 10 }}>Listing featured!</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>
              Payment of <b>${(data.payment.amount_cents / 100).toFixed(2)}</b> confirmed.
              Your listing is now featured until{' '}
              <b>{data.listing.featured_until ? new Date(data.listing.featured_until).toLocaleDateString() : '—'}</b>.
            </p>
            <div style={{ marginTop: 22 }}>
              <Link href="/dashboard" className="btn">Back to Dashboard</Link>
            </div>
          </>
        )}

        {state === 'pending' && (
          <>
            <div style={{ fontSize: 56 }}>⏳</div>
            <h1 style={{ marginTop: 10 }}>Payment processing</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>
              Stripe hasn't confirmed the payment yet. Refresh in a few seconds.
            </p>
            <button className="btn" onClick={() => window.location.reload()} style={{ marginTop: 20 }}>
              Refresh
            </button>
          </>
        )}

        {state === 'error' && (
          <>
            <div style={{ fontSize: 56 }}>⚠️</div>
            <h1 style={{ marginTop: 10 }}>Couldn't verify</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>
              Refresh, or check your billing history in the dashboard.
            </p>
            <Link href="/dashboard" className="btn" style={{ marginTop: 20 }}>Back to Dashboard</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense fallback={<div className="container" style={{ padding: 60 }}>Loading…</div>}><Inner /></Suspense>;
}