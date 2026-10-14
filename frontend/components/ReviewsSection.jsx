'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

function Stars({ value, size = 16 }) {
  const full  = Math.floor(value);
  const half  = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ color: '#f59e0b', fontSize: size, letterSpacing: 1 }}>
      {'★'.repeat(Math.max(0, full))}
      {half ? '⯨' : ''}
      {'☆'.repeat(Math.max(0, empty))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => onChange(n)}
          style={{
            border: 'none', background: 'transparent',
            fontSize: 26, lineHeight: 1, cursor: 'pointer',
            color: n <= value ? '#f59e0b' : '#d1d5db', padding: 0
          }}
          aria-label={`${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ listingId, data }) {
  const pathname = usePathname();

  // Fallback: if listingId prop is missing, try to extract it from the URL.
  // URL format: /listings/28  →  id = 28
  let resolvedId = listingId;
  if (!resolvedId && pathname) {
    const m = pathname.match(/\/listings\/(\d+)/);
    if (m) resolvedId = Number(m[1]);
  }

  console.log('🔍 ReviewsSection — prop listingId:', listingId, '| resolved:', resolvedId);

  const stats   = data?.stats   || { count: 0, average: 0, distribution: {1:0,2:0,3:0,4:0,5:0}, avg_recommend: 0, avg_value: 0, avg_quality: 0 };
  const reviews = data?.reviews || [];

  const [open, setOpen]       = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [form, setForm]       = useState({
    reviewer_name: '', reviewer_email: '',
    rating: 5, title: '', comment: '',
    rating_recommend: 5, rating_value: 5, rating_quality: 5
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resolvedId) {
      setError('Cannot determine listing id. Please refresh the page.');
      return;
    }
    if (!form.reviewer_name.trim()) { setError('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reviewer_email.trim())) {
      setError('Please enter a valid email.'); return;
    }
    if (!form.comment.trim()) { setError('Please write a review.'); return; }

    const payload = {
      listing_id:       Number(resolvedId),
      reviewer_name:    form.reviewer_name.trim(),
      reviewer_email:   form.reviewer_email.trim().toLowerCase(),
      rating:           Number(form.rating) || 5,
      title:            form.title.trim() || null,
      comment:          form.comment.trim(),
      rating_recommend: Number(form.rating_recommend) || 5,
      rating_value:     Number(form.rating_value)     || 5,
      rating_quality:   Number(form.rating_quality)   || 5
    };

    console.log('📤 Submitting review:', payload);

    setSending(true);
    try {
      const r = await api.post('/reviews', payload);
      setSuccess(r.message);
      setForm({
        reviewer_name: '', reviewer_email: '',
        rating: 5, title: '', comment: '',
        rating_recommend: 5, rating_value: 5, rating_quality: 5
      });
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section">
      <h2>Ratings and Reviews</h2>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 20, marginTop: 16 }}>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: '#0d6efd' }}>
            {Number(stats.average || 0).toFixed(1)}
          </div>
          <div style={{ marginTop: 4 }}>
            <Stars value={Number(stats.average)} size={22} />
          </div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>
            Based on {stats.count} review{stats.count === 1 ? '' : 's'}
          </div>

          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #f1f5f9' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              ['Recommend', stats.avg_recommend],
              ['Value',     stats.avg_value],
              ['Quality',   stats.avg_quality]
            ].map(([label, v]) => (
              <div key={label}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
                  {Number(v || 0).toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          {[5, 4, 3, 2, 1].map((n) => {
            const c = stats.distribution?.[n] || 0;
            const pct = stats.count ? (c / stats.count) * 100 : 0;
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ width: 20, fontSize: 13 }}>{n}★</span>
                <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 4 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: 4 }} />
                </div>
                <span style={{ width: 30, fontSize: 13, color: '#6b7280' }}>{c}</span>
              </div>
            );
          })}

          <div style={{ marginTop: 12 }}>
            {success && <div className="alert success">{success}</div>}
            {!open && (
              <button className="btn" style={{ width: '100%' }} onClick={() => setOpen(true)}>
                Write a review
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <form onSubmit={submit} className="card" style={{ padding: 20, marginTop: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Write a review</h3>
          {error && <div className="alert error">{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-row">
              <label>Your name *</label>
              <input required value={form.reviewer_name}
                     onChange={(e) => update('reviewer_name', e.target.value)} />
            </div>
            <div className="form-row">
              <label>Your email *</label>
              <input type="email" required value={form.reviewer_email}
                     onChange={(e) => update('reviewer_email', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <label>Overall rating *</label>
            <StarPicker value={form.rating} onChange={(v) => update('rating', v)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            <div className="form-row">
              <label>Would recommend</label>
              <StarPicker value={form.rating_recommend} onChange={(v) => update('rating_recommend', v)} />
            </div>
            <div className="form-row">
              <label>Value for money</label>
              <StarPicker value={form.rating_value} onChange={(v) => update('rating_value', v)} />
            </div>
            <div className="form-row">
              <label>Quality</label>
              <StarPicker value={form.rating_quality} onChange={(v) => update('rating_quality', v)} />
            </div>
          </div>

          <div className="form-row">
            <label>Title</label>
            <input value={form.title} placeholder="Summarize your experience"
                   onChange={(e) => update('title', e.target.value)} />
          </div>

          <div className="form-row">
            <label>Your review *</label>
            <textarea rows={4} required value={form.comment}
                      onChange={(e) => update('comment', e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" disabled={sending} type="submit">
              {sending ? 'Sending…' : 'Submit review'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: 20 }}>
        {reviews.length === 0 ? (
          <div className="card" style={{ padding: 20, color: '#6b7280' }}>
            No reviews yet. Be the first to review this listing.
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="card" style={{ padding: 18, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.reviewer_name}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              {r.title && <h4 style={{ marginTop: 10, marginBottom: 4 }}>{r.title}</h4>}
              <p style={{ whiteSpace: 'pre-line', color: '#374151', marginTop: 6 }}>
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}