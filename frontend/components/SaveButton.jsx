'use client';
import { useEffect, useState } from 'react';
import { api, getToken } from '@/lib/api';

export default function SaveButton({ listingId, variant = 'overlay' }) {
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const t = getToken();
    if (!t) { setLoggedIn(false); return; }
    (async () => {
      try {
        const r = await api.get(`/favorites/check/${listingId}`);
        setSaved(r.saved);
      } catch {}
    })();
  }, [listingId]);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!loggedIn) {
      if (confirm('Please log in to save listings. Go to login now?')) {
        window.location.href = '/login';
      }
      return;
    }

    setLoading(true);
    try {
      const r = await api.post(`/favorites/${listingId}`, {});
      setSaved(r.saved);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const baseStyle = {
    border: 'none',
    cursor: loading ? 'wait' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform .15s',
    background: 'transparent'
  };

  if (variant === 'overlay') {
    return (
      <button
        type="button"
        onClick={toggle}
        title={saved ? 'Remove from saved' : 'Save this listing'}
        style={{
          ...baseStyle,
          position: 'absolute',
          top: 8,
          right: 8,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(255,255,255,.9)',
          boxShadow: '0 2px 6px rgba(0,0,0,.1)',
          fontSize: 18,
          color: saved ? '#dc3545' : '#6b7280',
          zIndex: 2
        }}
        aria-label={saved ? 'Unsave' : 'Save'}
      >
        {saved ? '♥' : '♡'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      style={{
        ...baseStyle,
        padding: '8px 16px',
        borderRadius: 8,
        border: '1px solid ' + (saved ? '#dc3545' : '#d1d5db'),
        background: saved ? '#fee2e2' : '#fff',
        color: saved ? '#dc3545' : '#374151',
        fontWeight: 600,
        fontSize: 14,
        gap: 6
      }}
    >
      <span style={{ fontSize: 18 }}>{saved ? '♥' : '♡'}</span>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}