'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast'; // ← Added this
import 'react-quill/dist/quill.snow.css';
export default function AdminPage() {
  const [stats,    setStats]    = useState(null);
  const [listings, setListings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [tab,      setTab]      = useState('listings');
  
  // News Form State
const [newsForm, setNewsForm] = useState({ 
  title: '', 
  content: '', 
  imageFile: null,
  category: 'Industry News' // Added Category
});
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
    const formData = new FormData();
    formData.append('title', newsForm.title);
    formData.append('content', newsForm.content);
    formData.append('category', newsForm.category);
    if (newsForm.imageFile) {
      formData.append('image', newsForm.imageFile);
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) throw new Error('Failed to create post');

    toast.success('News post created!', { id: toastId });
    setNewsForm({ title: '', content: '', imageFile: null, category: 'Industry News' });
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
    <h3 style={{ marginBottom: 20 }}>Add New Post</h3>
    
    <form onSubmit={createNews} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30 }}>
      
      {/* LEFT COLUMN: Main Editor */}
      <div>
        <div className="form-row" style={{ marginBottom: 20 }}>
          <input 
            required 
            value={newsForm.title} 
            onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} 
            placeholder="Enter post title here..." 
            style={{ fontSize: 24, padding: 12, fontWeight: 600 }}
          />
        </div>

        {/* Rich Text Editor */}
        <div className="form-row">
          <label>Post Content</label>
          <div style={{ background: '#fff', minHeight: 400, marginBottom: 50 }}>
            <ReactQuill 
              theme="snow" 
              value={newsForm.content} 
              onChange={(content) => setNewsForm({ ...newsForm, content })}
              style={{ height: 350 }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar */}
      <div>
        {/* Publish Box */}
        <div className="card" style={{ padding: 20, marginBottom: 20, background: '#f8fafc' }}>
          <h4 style={{ marginBottom: 16 }}>Publish</h4>
          <button className="btn" type="submit" style={{ width: '100%' }}>Publish Post</button>
        </div>

        {/* Categories Box */}
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h4 style={{ marginBottom: 16 }}>Category</h4>
          <select 
            value={newsForm.category} 
            onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
            style={{ width: '100%', padding: 10 }}
          >
            <option value="Industry News">Industry News</option>
            <option value="MRI Parts">MRI Parts</option>
            <option value="CT Parts">CT Parts</option>
            <option value="MRI Safety">MRI Safety</option>
            <option value="Repairs & Maintenance">Repairs & Maintenance</option>
            <option value="Equipment Leasing">Equipment Leasing</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Featured Image Box */}
        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ marginBottom: 16 }}>Featured Image</h4>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setNewsForm({ ...newsForm, imageFile: e.target.files[0] })}
            style={{ padding: '8px 0', width: '100%' }} 
          />
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            Upload a cover image for the blog post.
          </p>
        </div>
      </div>
    </form>
  </div>
)}
    </div>
  );
}