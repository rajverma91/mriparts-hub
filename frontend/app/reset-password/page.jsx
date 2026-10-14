'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

function ResetInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const email = sp.get('email') || '';
  const token = sp.get('token') || '';

  async function submit(e) {
    e.preventDefault(); setError(''); setMsg('');
    try {
      const r = await api.post('/auth/reset-password', { email, token, newPassword: password });
      setMsg(r.message);
      setTimeout(() => router.push('/login'), 1500);
    } catch (e) { setError(e.message); }
  }

  return (
    <form onSubmit={submit} className="card form-narrow">
      <h1>Reset Password</h1>
      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="form-row"><label>Email</label>
        <input value={email} readOnly /></div>
      <div className="form-row"><label>New Password</label>
        <input type="password" required minLength={6}
               value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
      <button className="btn" style={{width:'100%'}}>Update password</button>
    </form>
  );
}

export default function ResetPage() {
  return <Suspense fallback={<div className="form-narrow">Loading...</div>}><ResetInner /></Suspense>;
}