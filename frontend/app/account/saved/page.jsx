'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default function SavedListingsPage() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/favorites/mine');
      setItems(r);
    } catch (e) {
      setError(e.message);
      if (e.message.toLowerCase().includes('auth')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function unsave(id) {
    if (!confirm('Remove this listing from your saved list?')) return;
    try {
      await api.post(`/favorites/${id}`, {});
      setItems(items.filter((x) => x.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div style={{ padding: 40, color: '#6b7280' }}>Loading…</div>;
  if (error)   return <div className="alert error">{error}</div>;

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Saved listings</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        {items.length} item{items.length === 1 ? '' : 's'} in your watchlist
      </p>

      {items.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>♡</div>
          <h3 style={{ marginBottom: 6 }}>Nothing saved yet</h3>
          <p style={{ color: '#6b7280', marginBottom: 16 }}>
            Browse the marketplace and tap the heart on any listing to save it here.
          </p>
          <Link href="/listings" className="btn">Browse listings</Link>
        </div>
      ) : (
        <div className="grid grid-3">
          {items.map((it) => (
            <div key={it.favorite_id} style={{ position: 'relative' }}>
              <ListingCard item={it} />
              <button
                onClick={() => unsave(it.id)}
                className="btn btn-outline"
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  padding: '4px 10px',
                  fontSize: 12,
                  background: 'rgba(255,255,255,.9)'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}