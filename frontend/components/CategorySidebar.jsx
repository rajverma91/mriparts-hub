'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CategorySidebar({ categories = [], brands = [] }) {
  const sp = useSearchParams();
  const currentCat = sp.get('category') || '';
  const currentBrand = sp.get('brand') || '';

  function urlWith(key, value) {
    const p = new URLSearchParams(sp.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('page');
    return `/listings?${p.toString()}`;
  }

  return (
    <aside>
      {/* Category tree */}
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginBottom: 10, fontSize: 15 }}>Category</h3>

        <Link
          href="/listings"
          className={!currentCat ? 'side-link active' : 'side-link'}
        >
          All Categories
        </Link>

        {categories.map((c) => (
          <Link
            key={c.id}
            href={urlWith('category', c.slug)}
            className={currentCat === c.slug ? 'side-link active' : 'side-link'}
          >
            {c.name}
            <span className="count">{c.count ?? 0}</span>
          </Link>
        ))}
      </div>

      {/* Brand filter */}
      <div className="card" style={{ padding: 16, marginTop: 14 }}>
        <h3 style={{ marginBottom: 10, fontSize: 15 }}>Brand</h3>
        <Link href={urlWith('brand', '')} className={!currentBrand ? 'side-link active' : 'side-link'}>
          All Brands
        </Link>
        {brands.map((b) => (
          <Link
            key={b.id}
            href={urlWith('brand', b.name)}
            className={currentBrand === b.name ? 'side-link active' : 'side-link'}
          >
            {b.name}
            <span className="count">{b.count ?? 0}</span>
          </Link>
        ))}
      </div>

      {/* Promo box */}
      <div
        className="card"
        style={{
          padding: 18,
          marginTop: 14,
          background: 'linear-gradient(135deg,#0d6efd 0%,#0a58ca 100%)',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: 28 }}>💼</div>
        <h3 style={{ margin: '8px 0', fontSize: 16 }}>Sell on MRI Parts Hub</h3>
        <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 12 }}>
          Reach buyers in 40+ countries. No commissions. Post free.
        </p>
        <Link href="/register" className="btn"
              style={{ background: '#fff', color: '#0d6efd', padding: '8px 16px' }}>
          Start selling
        </Link>
      </div>
    </aside>
  );
}