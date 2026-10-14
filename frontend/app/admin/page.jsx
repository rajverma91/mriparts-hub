'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AdminPage() {
  const [stats,    setStats]    = useState(null);
  const [listings, setListings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [tab,      setTab]      = useState('listings');

  async function load() {
    try {
      const [s, l, u, r] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/listings'),
        api.get('/admin/users'),
        api.get('/reviews/admin/all')
      ]);
      setStats(s);
      setListings(l);
      setUsers(u);
      setReviews(r);
    } catch (e) {
      console.error(e);
      if (e.message.toLowerCase().includes('admin') || e.message.includes('token')) {
        window.location.href = '/login';
      }
    }
  }

  useEffect(() => { load(); }, []);

  async function setListingStatus(id, status) {
    await api.patch(`/admin/listings/${id}/status`, { status });
    load();
  }

  async function reviewAction(id, action) {
    if (action === 'approve') await api.patch(`/reviews/${id}/approve`, {});
    if (action === 'reject')  await api.patch(`/reviews/${id}/reject`, {});
    if (action === 'delete') {
      if (!confirm('Delete this review?')) return;
      await api.del(`/reviews/${id}`);
    }
    load();
  }

  if (!stats) return <div className="container" style={{ padding: 40 }}>Loading or unauthorized...</div>;

  const pendingReviews = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1>Admin Dashboard</h1>

      <div className="grid grid-4" style={{ marginTop: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <b>Users</b><div style={{ fontSize: 28 }}>{stats.users}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <b>Listings</b><div style={{ fontSize: 28 }}>{stats.listings}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <b>Pending listings</b><div style={{ fontSize: 28 }}>{stats.pending}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <b>Pending reviews</b><div style={{ fontSize: 28, color: pendingReviews ? '#dc3545' : '#111827' }}>
            {pendingReviews}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className={`btn ${tab !== 'listings' ? 'btn-outline' : ''}`}
                onClick={() => setTab('listings')}>Listings</button>
        <button className={`btn ${tab !== 'reviews' ? 'btn-outline' : ''}`}
                onClick={() => setTab('reviews')}>
          Reviews {pendingReviews > 0 && (
            <span style={{
              background: '#dc3545', color: '#fff',
              borderRadius: 999, padding: '1px 7px', fontSize: 11, marginLeft: 4
            }}>{pendingReviews}</span>
          )}
        </button>
        <button className={`btn ${tab !== 'users' ? 'btn-outline' : ''}`}
                onClick={() => setTab('users')}>Users</button>
      </div>

      {/* LISTINGS TAB */}
      {tab === 'listings' && (
        <div className="card" style={{ padding: 20, marginTop: 14, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Title</th>
              <th style={{ padding: 8 }}>Seller</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr></thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>
                    <Link href={`/listings/${l.id}`} style={{ color: '#0d6efd' }}>{l.title}</Link>
                  </td>
                  <td style={{ padding: 8 }}>{l.seller_email}</td>
                  <td style={{ padding: 8 }}>
                    <span className={`badge ${l.status}`}>{l.status}</span>
                  </td>
                  <td style={{ padding: 8 }}>
                    <button className="btn" style={{ padding: '4px 10px', marginRight: 4 }}
                            onClick={() => setListingStatus(l.id, 'active')}>Approve</button>
                    <button className="btn btn-danger" style={{ padding: '4px 10px', marginRight: 4 }}
                            onClick={() => setListingStatus(l.id, 'rejected')}>Reject</button>
                    <button className="btn btn-outline" style={{ padding: '4px 10px' }}
                            onClick={() => setListingStatus(l.id, 'sold')}>Sold</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REVIEWS TAB */}
      {tab === 'reviews' && (
        <div className="card" style={{ padding: 20, marginTop: 14 }}>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r.id} style={{ borderTop: '1px solid #eee', padding: '14px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {r.reviewer_name}{' '}
                    <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}</span>{' '}
                    <span className={`badge ${r.status === 'approved' ? 'active' : r.status === 'rejected' ? 'rejected' : 'pending'}`}
                          style={{ marginLeft: 6 }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                    {r.reviewer_email} · {new Date(r.created_at).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    Listing: <Link href={`/listings/${r.listing_id}`} style={{ color: '#0d6efd' }}>
                      {r.listing_title}
                    </Link> · Seller: {r.seller_email}
                  </div>
                  {r.title && <h4 style={{ marginTop: 8 }}>{r.title}</h4>}
                  <p style={{ whiteSpace: 'pre-line', marginTop: 4 }}>{r.comment}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {r.status !== 'approved' && (
                    <button className="btn" style={{ padding: '4px 10px' }}
                            onClick={() => reviewAction(r.id, 'approve')}>Approve</button>
                  )}
                  {r.status !== 'rejected' && (
                    <button className="btn btn-outline" style={{ padding: '4px 10px' }}
                            onClick={() => reviewAction(r.id, 'reject')}>Reject</button>
                  )}
                  <button className="btn btn-danger" style={{ padding: '4px 10px' }}
                          onClick={() => reviewAction(r.id, 'delete')}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USERS TAB */}
      {tab === 'users' && (
        <div className="card" style={{ padding: 20, marginTop: 14, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Name</th>
              <th style={{ padding: 8 }}>Email</th>
              <th style={{ padding: 8 }}>Role</th>
              <th style={{ padding: 8 }}>Country</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{u.name}</td>
                  <td style={{ padding: 8 }}>{u.email}</td>
                  <td style={{ padding: 8 }}>{u.role}</td>
                  <td style={{ padding: 8 }}>{u.country || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}