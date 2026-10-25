'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

const SERVICES = [
  { title: 'MRI Part Repair', desc: 'Professional MRI parts repair and refurbishment services to help restore component performance, reduce equipment downtime, and extend the life of your medical imaging systems.' },
  { title: 'MRI De-Install & Install', desc: 'Reliable MRI system de-installation, relocation, and installation services to support equipment upgrades, facility moves, and new imaging center setups.' },
  { title: 'MRI Rental', desc: 'Flexible MRI equipment rental and leasing solutions to help hospitals and imaging centers meet diagnostic needs while managing upfront equipment costs.' },
];

export default function ServicesPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: 'MRI Part Repair'
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  async function submitRequest(e) {
    e.preventDefault();
    const toastId = toast.loading('Sending your request...');
    
    try {
      // We will send this to the inquiries endpoint
      // Since it's not tied to a specific listing, we'll send a special payload
      const res = await api.post('/inquiries/service-request', form);
      
      toast.success('Request sent! Our team will contact you shortly.', { id: toastId });
      setForm({ name: '', email: '', phone: '', address: '', service: 'MRI Part Repair' });
    } catch (err) {
      toast.error(err.message || 'Failed to send request. Please try again.', { id: toastId });
    }
  }

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>Services for medical equipment</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        Professional services offered by verified vendors on MRI Parts Hub.
      </p>

      {/* Services Cards */}
      <div className="grid grid-3">
        {SERVICES.map((s) => (
          <div key={s.title} className="card" style={{ padding: 22 }}>
            <h3 style={{ marginBottom: 8 }}>{s.title}</h3>
            <p style={{ color: '#6b7280', fontSize: 14 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Send Request Form */}
      <div className="card" style={{ padding: 32, marginTop: 40, maxWidth: 700, margin: '40px auto' }}>
        <h2 style={{ marginBottom: 8, textAlign: 'center' }}>Send a Service Request</h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
          Fill out the form below and our team will get back to you.
        </p>

        <form onSubmit={submitRequest}>
          <div className="form-row">
            <label>Full Name *</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" />
          </div>

          <div className="form-row">
            <label>Email Address *</label>
            <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="john@example.com" />
          </div>

          <div className="form-row">
            <label>Phone Number *</label>
            <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
          </div>

          <div className="form-row">
            <label>Address</label>
            <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="City, State, Country" />
          </div>

          <div className="form-row">
            <label>Service Required *</label>
            <select required value={form.service} onChange={(e) => update('service', e.target.value)}>
              <option value="MRI Part Repair">MRI Part Repair</option>
              <option value="MRI De-Install & Install">MRI De-Install & Install</option>
              <option value="MRI Rental">MRI Rental</option>
            </select>
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }}>
            Send Request
          </button>
        </form>
      </div>

      {/* Partner Banner */}
      {/* <div className="feature-banner" style={{ marginTop: 20, justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Offer your services</div>
          <p style={{ color: '#6b7280', marginTop: 6 }}>
            Join MRI Parts Hub as a service partner and reach buyers worldwide.
          </p>
          <Link href="/register" className="btn" style={{ marginTop: 12 }}>Become a service partner</Link>
        </div>
      </div> */}
    </div>
  );
}