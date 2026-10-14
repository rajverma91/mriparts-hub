'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortBar({ total = 0 }) {
  const sp = useSearchParams();
  const router = useRouter();

  const sort = sp.get('sort') || 'newest';
  const limit = sp.get('limit') || '20';

  function set(key, value) {
    const p = new URLSearchParams(sp.toString());
    p.set(key, value);
    p.delete('page');
    router.push(`/listings?${p.toString()}`);
  }

  return (
    <div className="sort-bar">
      <span style={{ color: '#6b7280', fontSize: 14 }}>
        <b style={{ color: '#111827' }}>{total}</b> ads found
      </span>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Sort by:</label>
        <select value={sort} onChange={(e) => set('sort', e.target.value)}
                style={{ width: 160, padding: '6px 10px' }}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>

        <label style={{ fontSize: 13, color: '#6b7280', marginLeft: 8 }}>Show:</label>
        <select value={limit} onChange={(e) => set('limit', e.target.value)}
                style={{ width: 80, padding: '6px 10px' }}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
}