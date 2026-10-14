'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault(); setError(''); setMsg('');
    try {
      const r = await api.post('/auth/forgot-password', { email });
      setMsg(r.message);
    } catch (e) { setError(e.message); }
  }

  return (
    <form onSubmit={submit} className="card form-narrow">
      <h1>Forgot Password</h1>
      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="form-row"><label>Email</label>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
      <button className="btn" style={{width:'100%'}}>Send reset link</button>
      <p style={{marginTop:14,fontSize:14,textAlign:'center'}}>
        <Link href="/login" style={{color:'#0d6efd'}}>Back to login</Link>
      </p>
    </form>
  );
}