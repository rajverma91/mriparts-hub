'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function InquiryForm({ listingId }) {
  const [form, setForm] = useState({ buyer_name: '', buyer_email: '', buyer_phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const update = (k, v) => setForm({ ...form, [k]: v });

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');

    try {
      const r = await api.post('/inquiries', { listing_id: listingId, ...form });
      setSuccess(r.message);
      setForm({ buyer_name: '', buyer_email: '', buyer_phone: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card" style={{ padding: 18, marginTop: 12 }}>
      <h3 style={{ marginBottom: 12 }}>Send Inquiry to Seller</h3>

      {success && <div className="alert success">{success}</div>}
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={submit}>
        <div className="form-row">
          <label>Your Name *</label>
          <input
            required
            value={form.buyer_name}
            onChange={(e) => update('buyer_name', e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Your Email *</label>
          <input
            type="email"
            required
            value={form.buyer_email}
            onChange={(e) => update('buyer_email', e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Phone (optional)</label>
          <input
            value={form.buyer_phone}
            onChange={(e) => update('buyer_phone', e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Message *</label>
          <textarea
            rows={4}
            required
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="I'm interested in this item. Please share availability and shipping details."
          />
        </div>

        <button className="btn" disabled={sending} style={{ width: '100%' }}>
          {sending ? 'Sending…' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
}