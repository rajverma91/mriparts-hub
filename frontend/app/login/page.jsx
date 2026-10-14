'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault(); setError('');
    try {
      const r = await api.post('/auth/login', { email, password });
      setToken(r.token);
      router.push('/dashboard');
    } catch (e) { setError(e.message); }
  }

  return (
    <form onSubmit={submit} className="card form-narrow">
      <h1>Login</h1>
      {error && <div className="alert error">{error}</div>}
      <div className="form-row">
        <label>Email</label>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Password</label>
        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
      </div>
      <button className="btn" style={{width:'100%'}}>Login</button>
      <p style={{marginTop:14,fontSize:14,textAlign:'center'}}>
        <Link href="/forgot-password" style={{color:'#0d6efd'}}>Forgot password?</Link>
      </p>
      <p style={{marginTop:8,fontSize:14,textAlign:'center'}}>
        New here? <Link href="/register" style={{color:'#0d6efd'}}>Create account</Link>
      </p>
    </form>
  );
}