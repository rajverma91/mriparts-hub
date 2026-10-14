'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function FilterSidebar({ categories = [], brands = [] }) {
  const sp = useSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({
    q: sp.get('q') || '',
    category: sp.get('category') || '',
    brand: sp.get('brand') || '',
    condition: sp.get('condition') || '',
    country: sp.get('country') || '',
    minPrice: sp.get('minPrice') || '',
    maxPrice: sp.get('maxPrice') || '',
    sort: sp.get('sort') || 'newest'
  });

  function update(k, v) { setForm({ ...form, [k]: v }); }

  function apply(e) {
    if (e) e.preventDefault();
    const p = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => { if (v) p.set(k, v); });
    router.push(`/listings?${p.toString()}`);
  }

  function reset() {
    setForm({ q:'',category:'',brand:'',condition:'',country:'',minPrice:'',maxPrice:'',sort:'newest' });
    router.push('/listings');
  }

  return (
    <form onSubmit={apply} className="card filter-box">
      <h3>Filters</h3>

      <div className="field">
        <label>Search</label>
        <input value={form.q} onChange={(e)=>update('q',e.target.value)} placeholder="Keyword" />
      </div>

      <div className="field">
        <label>Category</label>
        <select value={form.category} onChange={(e)=>update('category',e.target.value)}>
          <option value="">All</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name} ({c.count})</option>)}
        </select>
      </div>

      <div className="field">
        <label>Brand</label>
        <select value={form.brand} onChange={(e)=>update('brand',e.target.value)}>
          <option value="">All</option>
          {brands.map(b => <option key={b.id} value={b.name}>{b.name} ({b.count})</option>)}
        </select>
      </div>

      <div className="field">
        <label>Condition</label>
        <select value={form.condition} onChange={(e)=>update('condition',e.target.value)}>
          <option value="">Any</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
      </div>

      <div className="field">
        <label>Country</label>
        <input value={form.country} onChange={(e)=>update('country',e.target.value)} placeholder="e.g. USA" />
      </div>

      <div className="field">
        <label>Price range</label>
        <div style={{display:'flex',gap:8}}>
          <input type="number" placeholder="Min" value={form.minPrice} onChange={(e)=>update('minPrice',e.target.value)} />
          <input type="number" placeholder="Max" value={form.maxPrice} onChange={(e)=>update('maxPrice',e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Sort by</label>
        <select value={form.sort} onChange={(e)=>update('sort',e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <button className="btn" type="submit" style={{width:'100%'}}>Apply Filters</button>
      <button type="button" onClick={reset} className="btn btn-outline"
              style={{width:'100%',marginTop:8}}>Reset</button>
    </form>
  );
}