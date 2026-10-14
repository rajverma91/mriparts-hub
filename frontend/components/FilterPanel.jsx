'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FilterPanel() {
  const sp = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({
    q: sp.get('q') || '',
    condition: sp.get('condition') || '',
    country: sp.get('country') || '',
    minPrice: sp.get('minPrice') || '',
    maxPrice: sp.get('maxPrice') || '',
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  function apply(e) {
    e.preventDefault();
    const p = new URLSearchParams(sp.toString());
    Object.entries(form).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k);
    });
    p.delete('page');
    router.push(`/listings?${p.toString()}`);
  }

  return (
    <div className="card" style={{ padding: 16, marginBottom: 14 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          all: 'unset', width: '100%', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between',
          fontWeight: 700, fontSize: 15
        }}
      >
        Filter <span>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <form onSubmit={apply} style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 13, color: '#374151' }}>Keyword</label>
            <input value={form.q} onChange={(e) => update('q', e.target.value)} placeholder="e.g. MRI" />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 13, color: '#374151' }}>Condition</label>
            <select value={form.condition} onChange={(e) => update('condition', e.target.value)}>
              <option value="">Any</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 13, color: '#374151' }}>Country</label>
            <input value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="e.g. USA" />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 13, color: '#374151' }}>Price range</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" placeholder="Min" value={form.minPrice}
                     onChange={(e) => update('minPrice', e.target.value)} />
              <input type="number" placeholder="Max" value={form.maxPrice}
                     onChange={(e) => update('maxPrice', e.target.value)} />
            </div>
          </div>

          <button className="btn" style={{ width: '100%' }}>Apply filters</button>
        </form>
      )}
    </div>
  );
}