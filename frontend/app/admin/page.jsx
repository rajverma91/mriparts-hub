'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast'; // ← Added this

export default function AdminPage() {
  const [stats,    setStats]    = useState(null);
  const [listings, setListings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [tab,      setTab]      = useState('listings');
  
  // News Form State
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image_url: '' });

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

  async function createNews(e) {
    e.preventDefault();
    const toastId = toast.loading('Publishing post...');
    try {
      await api.post('/news', newsForm);
      toast.success('News post created!', { id: toastId });
      setNewsForm({ title: '', content: '', image_url: '' });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  }

  if (!stats) return <div className="container" style={{ padding: 40 }}>Loading or unauthorized...</div>;

  const pendingReviews = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1>Admin Dashboard</h1>

      <div className="grid grid-4" style={{ marginTop: 20 }}>
        <div className="card" style={{ padding: 20 }}><b>Users</b><div style={{ fontSize: 28 }}>{stats.users}</div></div>
        <div className="card" style={{ padding: 20 }}><b>Listings</b><div style={{ fontSize: 28 }}>{stats.listings}</div></div>
        <div className="card" style={{ padding: 20 }}><b>Pending listings</b><div style={{ fontSize: 28 }}>{stats.pending}</div></div>
        <div className="card" style={{ padding: 20 }}>
          <b>Pending reviews</b>
          <div style={{ fontSize: 28, color: pendingReviews ? '#dc3545' : '#111827' }}>{pendingReviews}</div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className={`btn ${tab !== 'listings' ? 'btn-outline' : ''}`} onClick={() => setTab('listings')}>Listings</button>
        <button className={`btn ${tab !== 'reviews' ? 'btn-outline' : ''}`} onClick={() => setTab('reviews')}>
          Reviews {pendingReviews > 0 && <span style={{ background: '#dc3545', color: '#fff', borderRadius: 999, padding: '1px 7px', fontSize: 11, marginLeft: 4 }}>{pendingReviews}</span>}
        </button>
        <button className={`btn ${tab !== 'users' ? 'btn-outline' : ''}`} onClick={() => setTab('users')}>Users</button>
        {/* New News Tab */}
        <button className={`btn ${tab !== 'news' ? 'btn-outline' : ''}`} onClick={() => setTab('news')}>News / Blog</button>
      </div>

      {/* LISTINGS TAB */}
      {tab === 'listings' && (
        <div className="card" style={{ padding: 20, marginTop: 14, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Title</th><th style={{ padding: 8 }}>Seller</th><th style={{ padding: 8 }}>Status</th><th style={{ padding: 8 }}>Actions</th>
            </tr></thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}><Link href={`/listings/${l.slug || l.id}`} style={{ color: '#0d6efd' }}>{l.title}</Link></td>
                  <td style={{ padding: 8 }}>{l.seller_email}</td>
                  <td style={{ padding: 8 }}><span className={`badge ${l.status}`}>{l.status}</span></td>
                  <td style={{ padding: 8 }}>
                    {l.status === 'pending' && (
                      <>
                        <button className="btn" style={{ padding: '4px 10px', marginRight: 4 }} onClick={() => setListingStatus(l.id, 'active')}>Approve</button>
                        <button className="btn btn-danger" style={{ padding: '4px 10px' }} onClick={() => setListingStatus(l.id, 'rejected')}>Reject</button>
                      </>
                    )}
                    {l.status === 'active' && (
                      <>
                        <Link className="btn btn-outline" href={`/dashboard/listings/${l.id}`} style={{ padding: '4px 10px', marginRight: 4 }}>Edit</Link>
                        <button className="btn btn-outline" style={{ padding: '4px 10px', marginRight: 4 }} onClick={() => setListingStatus(l.id, 'sold')}>Mark Sold</button>
                        <button className="btn btn-danger" style={{ padding: '4px 10px' }} onClick={() => setListingStatus(l.id, 'rejected')}>Reject</button>
                      </>
                    )}
                    {(l.status === 'sold' || l.status === 'rejected') && (
                      <button className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={() => setListingStatus(l.id, 'active')}>Re-activate</button>
                    )}
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
                  <div style={{ fontWeight: 700 }}>{r.reviewer_name} <span className={`badge ${r.status === 'approved' ? 'active' : r.status === 'rejected' ? 'rejected' : 'pending'}`}>{r.status}</span></div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{r.comment}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {r.status !== 'approved' && <button className="btn" style={{ padding: '4px 10px' }} onClick={() => reviewAction(r.id, 'approve')}>Approve</button>}
                  {r.status !== 'rejected' && <button className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={() => reviewAction(r.id, 'reject')}>Reject</button>}
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
              <th style={{ padding: 8 }}>Name</th><th style={{ padding: 8 }}>Email</th><th style={{ padding: 8 }}>Role</th><th style={{ padding: 8 }}>Country</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{u.name}</td><td style={{ padding: 8 }}>{u.email}</td><td style={{ padding: 8 }}>{u.role}</td><td style={{ padding: 8 }}>{u.country || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NEWS TAB */}
      {tab === 'news' && (
        <div className="card" style={{ padding: 24, marginTop: 14 }}>
          <h3 style={{ marginBottom: 16 }}>Create a News Post</h3>
          <form onSubmit={createNews}>
            <div className="form-row">
              <label>Title</label>
              <input required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="e.g. Welcome to MRI Parts Hub" />
            </div>
            <div className="form-row">
              <label>Image URL (Optional)</label>
              <input value={newsForm.image_url} onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-row">
              <label>Content</label>
              <textarea required rows={6} value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} placeholder="Write your article here..." />
            </div>
            <button className="btn">Publish Post</button>
          </form>
        </div>
      )}
    </div>
  );
}