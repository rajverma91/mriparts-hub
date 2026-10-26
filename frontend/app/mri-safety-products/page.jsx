'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function SafetyProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentCat = searchParams.get('category') || '';
  const currentQ = searchParams.get('q') || '';

  const [searchQ, setSearchQ] = useState(currentQ);
  const [searchCat, setSearchCat] = useState(currentCat);

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  // 1. Fetch ALL Categories for the dropdown
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/categories`);
        if (res.ok) {
          const allCats = await res.json();
          setCategories(allCats); // <--- SHOW ALL CATEGORIES HERE
        }
      } catch (e) { console.error(e); }
    })();
  }, []);

  // 2. Fetch Listings
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCat) params.append('category', currentCat);
        if (currentQ) params.append('q', currentQ);
        params.append('limit', '100'); 

        const res = await fetch(`${API}/listings?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setListings(data.data || []);
          setVisibleCount(9); 
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentCat, currentQ]);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCat) params.append('category', searchCat);
    if (searchQ) params.append('q', searchQ);
    router.push(`/mri-safety-products?${params.toString()}`);
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 1200 }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{ marginBottom: 8 }}>MRI Safety Products</h1>
        <p style={{ color: '#6b7280' }}>Ensure patient and staff safety with ferromagnetic detectors, warning signs, and more.</p>
      </div>

      <form onSubmit={handleSearch} className="card" style={{ padding: 12, marginBottom: 30, display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 800, margin: '0 auto 30px' }}>
        <input 
          type="text" 
          placeholder="Search safety products..." 
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          style={{ flex: 1, minWidth: 200, border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: 8 }}
        />
        <select 
          value={searchCat} 
          onChange={(e) => setSearchCat(e.target.value)}
          style={{ width: 220, border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: 8 }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <button type="submit" className="btn" style={{ padding: '10px 24px' }}>Search</button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center', padding: 40 }}>Loading products...</p>
      ) : listings.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
          No products found matching your search.
        </div>
      ) : (
        <>
          <div className="grid grid-3">
            {listings.slice(0, visibleCount).map(item => (
              <Link key={item.id} href={`/listings/${item.slug || item.id}`} className="card listing-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 180, background: '#f3f4f6' }}>
                  <img src={item.image_url || 'https://via.placeholder.com/400x300?text=Safety+Product'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#0d6efd', fontWeight: 700, marginBottom: 6 }}>{item.category}</div>
                  <h3 style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</h3>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                    {item.brand && <>{item.brand} · </>}{item.condition_type}
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0d6efd' }}>
                      {item.currency} {Number(item.price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleCount < listings.length && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button className="btn btn-outline" onClick={handleLoadMore} style={{ padding: '12px 30px', fontSize: 16 }}>
                Load More Products
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SafetyProductsPage() {
  return <Suspense fallback={<div className="container" style={{ padding: 40 }}>Loading...</div>}><SafetyProductsContent /></Suspense>;
}