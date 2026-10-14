'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [me, setMe]             = useState(null);
  const [listings, setListings] = useState([]);
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [u, l] = await Promise.all([api.get('/auth/me'), api.get('/listings/user/mine')]);
        setMe(u);
        setListings(l);
      } catch (e) {
        console.error(e);
        window.location.href = '/login';
      }
    })();
  }, []);

  async function sendVerification() {
    setSending(true);
    try {
      await api.post('/auth/send-verification', {});
      setSent(true);
    } catch (e) {
      alert(e.message);
    } finally {
      setSending(false);
    }
  }

  async function del(id) {
    if (!confirm('Delete this listing?')) return;
    await api.del(`/listings/${id}`);
    setListings(listings.filter((l) => l.id !== id));
  }

  if (!me) return <div className="container" style={{ padding: 40 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      {/* Verification banner */}
      {!me.email_verified && (
        <div
          className="card"
          style={{
            padding: '14px 18px',
            marginBottom: 20,
            background: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#92400e',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          <div>
            <b>⚠️ Your email isn't verified yet.</b>{' '}
            <span style={{ color: '#78350f' }}>
              Verify to publish new listings and appear in search results.
            </span>
          </div>
          {sent ? (
            <span style={{ color: '#166534', fontWeight: 600 }}>
              ✓ Verification email sent
            </span>
          ) : (
            <button className="btn" onClick={sendVerification} disabled={sending}>
              {sending ? 'Sending…' : 'Send verification email'}
            </button>
          )}
        </div>
      )}

      {me.email_verified && (
        <div
          style={{
            marginBottom: 20,
            color: '#166534',
            background: '#dcfce7',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <b>✓ Email verified</b>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {me.name}</h1>
        <Link href="/dashboard/listings/new" className="btn">+ New Listing</Link>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 20 }}>
        <h2 style={{ marginBottom: 12 }}>My Listings ({listings.length})</h2>
        {listings.length === 0 && <p>No listings yet.</p>}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 10 }}>
                  <Link href={`/listings/${l.id}`}>{l.title}</Link>
                </td>
                <td style={{ padding: 10 }}><span className={`badge ${l.status}`}>{l.status}</span></td>
                <td style={{ padding: 10 }}>{l.currency} {Number(l.price || 0).toLocaleString()}</td>
                <td style={{ padding: 10, textAlign: 'right' }}>
                  <Link className="btn btn-outline" href={`/dashboard/listings/${l.id}`}
                        style={{ padding: '6px 12px', marginRight: 6 }}>Edit</Link>
                  <button className="btn btn-danger" style={{ padding: '6px 12px' }}
                          onClick={() => del(l.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}