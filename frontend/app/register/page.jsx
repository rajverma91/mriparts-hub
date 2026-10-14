'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name:'', email:'', password:'', company:'', phone:'', country:'', role:'buyer'
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const update = (k,v) => setForm({...form,[k]:v});

  async function submit(e) {
    e.preventDefault(); setError('');
    try {
      const r = await api.post('/auth/register', form);
      setToken(r.token);
      router.push('/dashboard');
    } catch (e) { setError(e.message); }
  }

  return (
    <form onSubmit={submit} className="card form-narrow">
      <h1>Create account</h1>
      {error && <div className="alert error">{error}</div>}
      <div className="form-row"><label>Full Name</label>
        <input required value={form.name} onChange={(e)=>update('name',e.target.value)} /></div>
      <div className="form-row"><label>Email</label>
        <input type="email" required value={form.email} onChange={(e)=>update('email',e.target.value)} /></div>
      <div className="form-row"><label>Password</label>
        <input type="password" required minLength={6}
               value={form.password} onChange={(e)=>update('password',e.target.value)} /></div>
      <div className="form-row"><label>Company (optional)</label>
        <input value={form.company} onChange={(e)=>update('company',e.target.value)} /></div>
      <div className="form-row"><label>Phone</label>
        <input value={form.phone} onChange={(e)=>update('phone',e.target.value)} /></div>
      <div className="form-row"><label>Country</label>
        <input value={form.country} onChange={(e)=>update('country',e.target.value)} /></div>
      <div className="form-row"><label>I want to</label>
        <select value={form.role} onChange={(e)=>update('role',e.target.value)}>
          <option value="buyer">Buy equipment</option>
          <option value="seller">Sell equipment</option>
        </select></div>
      <button className="btn" style={{width:'100%'}}>Sign up</button>
      <p style={{marginTop:14,fontSize:14,textAlign:'center'}}>
        Have an account? <Link href="/login" style={{color:'#0d6efd'}}>Login</Link>
      </p>
    </form>
  );
}