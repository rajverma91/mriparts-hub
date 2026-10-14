import Link from 'next/link';
import CategorySidebar  from '@/components/CategorySidebar';
import SortBar          from '@/components/SortBar';
import ListingRow       from '@/components/ListingRow';
import SubscribeBar     from '@/components/SubscribeBar';
import PopularSearches  from '@/components/PopularSearches';
import FilterPanel      from '@/components/FilterPanel';
import AdvertTypeFilter from '@/components/AdvertTypeFilter';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJson(path) {
  try {
    const r = await fetch(`${API}${path}`, { cache: 'no-store' });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

export default async function ListingsPage({ searchParams }) {
  const page  = Math.max(1, parseInt(searchParams.page || '1'));
  const limit = Math.min(60, Math.max(5, parseInt(searchParams.limit || '20')));

  const qs = new URLSearchParams({ ...searchParams, page, limit }).toString();

  const [listings, categories, brands] = await Promise.all([
    fetchJson(`/listings?${qs}`),
    fetchJson('/categories'),
    fetchJson('/brands'),
  ]);

  const total      = listings?.total ?? 0;
  const totalPages = listings?.pages ?? 1;
  const rows       = listings?.data ?? [];

  function pageUrl(p) {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    return `/listings?${next.toString()}`;
  }

  return (
    <div className="container" style={{ padding: '24px 20px 60px' }}>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        <Link href="/" style={{ color: '#0d6efd' }}>Home</Link>
        <span> › </span>
        <span>Medical equipment</span>
      </div>

      <h1 style={{ fontSize: 26, marginBottom: 20 }}>
        Medical Equipment For Sale
      </h1>

      <div className="filters-layout">
        {/* COLUMN 1: sidebar */}
        <div>
          <AdvertTypeFilter />
          <FilterPanel />
          <CategorySidebar categories={categories || []} brands={brands || []} />
        </div>

        {/* COLUMN 2: main content */}
        <div>
          <SortBar total={total} />

          {rows.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
              No listings match your filters.
              <div style={{ marginTop: 12 }}>
                <Link href="/listings" className="btn btn-outline">Clear filters</Link>
              </div>
            </div>
          ) : (
            rows.map((item, i) => (
              <ListingRow key={item.id} item={item} isTop={i < 2 && page === 1} />
            ))
          )}

          {totalPages > 1 && (
            <div className="pagination">
              {page > 1 && <Link href={pageUrl(page - 1)} className="page-btn">‹</Link>}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p} style={{ display: 'inline-flex', gap: 6 }}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="page-dots">…</span>}
                    <Link href={pageUrl(p)} className={p === page ? 'page-btn active' : 'page-btn'}>
                      {p}
                    </Link>
                  </span>
                ))}
              {page < totalPages && <Link href={pageUrl(page + 1)} className="page-btn">›</Link>}
            </div>
          )}

          <SubscribeBar />
          <PopularSearches />
        </div>
      </div>
    </div>
  );
}