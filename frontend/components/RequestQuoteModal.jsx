'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function RequestQuoteModal({ listingId, isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const update = (k, v) => setForm({ ...form, [k]: v });

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    const toastId = toast.loading('Sending quote request...');

    try {
      // Reusing the inquiries endpoint
      await api.post('/inquiries', {
        listing_id: listingId,
        buyer_name: form.name,
        buyer_email: form.email,
        buyer_phone: form.phone,
        message: `[Quote Request] ${form.message}` // Adding a prefix so the seller knows it's a quote request
      });

      toast.success('Request sent! The seller will contact you shortly.', { id: toastId });
      setForm({ name: '', email: '', phone: '', message: '' });
      onClose(); // Close the modal
    } catch (err) {
      toast.error(err.message || 'Failed to send request', { id: toastId });
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 500, position: 'relative' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280' }}
        >
          ✕
        </button>

        <div style={{ padding: 32 }}>
          <h2 style={{ marginBottom: 8, textAlign: 'center' }}>Request a Quote</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: 24, fontSize: 14 }}>
            Send your requirements to the seller and they will provide a quote.
          </p>

          <form onSubmit={submit}>
            <div className="form-row">
              <label>Your Name *</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" />
            </div>

            <div className="form-row">
              <label>Your Email *</label>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="john@example.com" />
            </div>

            <div className="form-row">
              <label>Phone (optional)</label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>

            <div className="form-row">
              <label>Message *</label>
              <textarea required rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Please provide pricing, availability, and shipping details..." />
            </div>

            <button type="submit" className="btn" disabled={sending} style={{ width: '100%', marginTop: 10 }}>
              {sending ? 'Sending...' : 'Send Quote Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}