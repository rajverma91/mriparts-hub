import Link from 'next/link';
import FilterSidebar from '@/components/FilterSidebar';
import ListingCard from '@/components/ListingCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJson(path) {
  try {
    const r = await fetch(`${API}${path}`, { cache: 'no-store' });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

export default async function SearchPage({ searchParams }) {
  const qs = new URLSearchParams(searchParams).toString();
  const [listings, categories, brands] = await Promise.all([
    fetchJson(`/listings?${qs}`),
    fetchJson('/categories'),
    fetchJson('/brands'),
  ]);

  const rows = listings?.data || [];
  const total = listings?.total || 0;

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>Search results</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        {total} matching advert{total === 1 ? '' : 's'}
        {searchParams.q ? <> for <b>"{searchParams.q}"</b></> : null}
      </p>

      <div className="filters-layout">
        <FilterSidebar categories={categories || []} brands={brands || []} />

        <div>
          {rows.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
              No listings match your search.
              <div style={{ marginTop: 12 }}>
                <Link href="/listings" className="btn btn-outline">Browse all</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-3">
              {rows.map((item) => <ListingCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
