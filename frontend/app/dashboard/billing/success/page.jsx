'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const sessionId = sp.get('session_id');
  const [state, setState] = useState('loading');

  useEffect(() => {
    if (!sessionId) {
      setState('error');
      return;
    }

    (async () => {
      try {
        const r = await api.get(`/payments/verify/${sessionId}`);
        
        // If it was a Pro subscription
        if (r.type === 'pro_subscription') {
          toast.success('Upgraded to Pro! You can post unlimited listings.');
          setState('pro');
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }

        // If it was a Featured Listing
        if (r.type === 'featured_listing') {
          toast.success('Listing featured successfully!');
          setState('featured');
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }

        setState('success');
      } catch (err) {
        console.error(err);
        setState('error');
      }
    })();
  }, [sessionId, router]);

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        {state === 'loading' && (
          <>
            <div style={{ fontSize: 48 }}>⏳</div>
            <h1 style={{ marginTop: 16 }}>Verifying your payment...</h1>
          </>
        )}

        {state === 'featured' && (
          <>
            <div style={{ fontSize: 64 }}>⭐</div>
            <h1 style={{ marginTop: 16 }}>Listing Featured!</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>
              Your listing is now at the top of the homepage with a gold badge.
            </p>
            <Link href="/dashboard" className="btn" style={{ marginTop: 24 }}>
              Go to Dashboard
            </Link>
          </>
        )}

        {state === 'pro' && (
          <>
            <div style={{ fontSize: 64 }}>🚀</div>
            <h1 style={{ marginTop: 16 }}>Welcome to Pro!</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>
              Your account has been upgraded. You can now post unlimited listings.
            </p>
            <Link href="/dashboard" className="btn" style={{ marginTop: 24 }}>
              Start Posting
            </Link>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={{ fontSize: 64 }}>✅</div>
            <h1 style={{ marginTop: 16 }}>Payment Successful</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>
              Thank you for your purchase.
            </p>
            <Link href="/dashboard" className="btn" style={{ marginTop: 24 }}>
              Go to Dashboard
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div style={{ fontSize: 64 }}>❌</div>
            <h1 style={{ marginTop: 16 }}>Something Went Wrong</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <Link href="/dashboard" className="btn" style={{ marginTop: 24 }}>
              Back to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: 60, textAlign: 'center' }}>Loading...</div>}>
      <Inner />
    </Suspense>
  );
}