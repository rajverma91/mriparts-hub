'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function VerifyInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState('loading'); // loading | success | error | already
  const [message, setMessage] = useState('');

  const token = sp.get('token');
  const email = sp.get('email');

  useEffect(() => {
    if (!token || !email) {
      setState('error');
      setMessage('Missing verification token or email in the link.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${API}/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        );
        const data = await res.json();

        if (!res.ok) {
          setState('error');
          setMessage(data.error || 'Verification failed.');
          return;
        }

        setState(data.already ? 'already' : 'success');
        setMessage(data.message);
      } catch (e) {
        setState('error');
        setMessage(e.message);
      }
    })();
  }, [token, email]);

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 560, margin: '0 auto' }}>
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        {state === 'loading' && (
          <>
            <div style={{ fontSize: 40 }}>⏳</div>
            <h1 style={{ marginTop: 10 }}>Verifying your email…</h1>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={{ fontSize: 56 }}>✅</div>
            <h1 style={{ marginTop: 10 }}>Email verified!</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>{message}</p>
            <div style={{ marginTop: 22, display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Link href="/dashboard" className="btn">Go to Dashboard</Link>
              <Link href="/listings" className="btn btn-outline">Browse listings</Link>
            </div>
          </>
        )}

        {state === 'already' && (
          <>
            <div style={{ fontSize: 56 }}>✓</div>
            <h1 style={{ marginTop: 10 }}>Already verified</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>{message}</p>
            <Link href="/dashboard" className="btn" style={{ marginTop: 20 }}>
              Go to Dashboard
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div style={{ fontSize: 56 }}>❌</div>
            <h1 style={{ marginTop: 10 }}>Verification failed</h1>
            <p style={{ color: '#6b7280', marginTop: 10 }}>{message}</p>
            <div style={{ marginTop: 22, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn">Back to Dashboard</Link>
              <Link href="/login" className="btn btn-outline">Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: 60 }}>Loading…</div>}>
      <VerifyInner />
    </Suspense>
  );
}