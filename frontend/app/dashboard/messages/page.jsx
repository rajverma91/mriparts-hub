'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const m = await api.get('/inquiries/mine');
      setMessages(m);
    } catch (e) {
      console.error(e);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    await api.patch(`/inquiries/${id}/read`, {});
    load();
  }

  async function del(id) {
    if (!confirm('Delete this inquiry?')) return;
    await api.del(`/inquiries/${id}`);
    load();
  }

  if (loading) return <div className="container" style={{ padding: 40 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 900 }}>
      <h1>Inbox</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>
        {messages.length} total · {messages.filter((m) => !m.is_read).length} unread
      </p>

      {messages.length === 0 && (
        <div className="card" style={{ padding: 24 }}>
          No inquiries yet. When a buyer sends a message about your listing, it will show up here.
        </div>
      )}

      {messages.map((m) => (
        <div key={m.id} className="card" style={{ padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ marginBottom: 4 }}>
                {!m.is_read && <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>NEW</span>}{' '}
                {m.buyer_name}
              </h3>
              <p style={{ color: '#6b7280', fontSize: 13 }}>
                <a href={`mailto:${m.buyer_email}`} style={{ color: '#0d6efd' }}>{m.buyer_email}</a>
                {m.buyer_phone && <> · {m.buyer_phone}</>}
              </p>
              <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                About: <Link href={`/listings/${m.listing_id}`} style={{ color: '#0d6efd' }}>
                  {m.listing_title}
                </Link>{' '}
                · {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              {!m.is_read && (
                <button className="btn btn-outline" style={{ padding: '6px 12px', marginRight: 6 }}
                        onClick={() => markRead(m.id)}>Mark read</button>
              )}
              <button className="btn btn-danger" style={{ padding: '6px 12px' }}
                      onClick={() => del(m.id)}>Delete</button>
            </div>
          </div>
          <p style={{ whiteSpace: 'pre-line', marginTop: 12 }}>{m.message}</p>
          <a className="btn" style={{ marginTop: 12, padding: '6px 14px' }}
             href={`mailto:${m.buyer_email}?subject=Re: ${m.listing_title}`}>Reply by Email</a>
        </div>
      ))}
    </div>
  );
}