'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SavedCountBadge({ listingId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!listingId) return;
    (async () => {
      try {
        const r = await fetch(`${API}/favorites/listing/${listingId}/count`);
        if (!r.ok) return;
        const d = await r.json();
        setCount(d.count || 0);
      } catch {}
    })();
  }, [listingId]);

  if (count === 0) return null;

  return (
    <span
      style={{
        fontSize: 13,
        color: '#dc3545',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontWeight: 500
      }}
    >
      <span style={{ fontSize: 15 }}>♥</span>
      {count} buyer{count === 1 ? '' : 's'} saved this
    </span>
  );
}