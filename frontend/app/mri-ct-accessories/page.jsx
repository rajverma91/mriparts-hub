'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function AccessoriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentCat = searchParams.get('category') || '';
  const currentQ = searchParams.get('q') || '';

  const [searchQ, setSearchQ] = useState(currentQ);
  const [searchCat, setSearchCat] = useState(currentCat);

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Categories for the sidebar and dropdown
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/categories`);
        if (res.ok) {
          const allCats = await res.json();
          
          // Filter categories that belong to Accessories
          const accessoryCats = allCats.filter(c => 
            c.slug.includes('accessor') || 
            c.name.toLowerCase().includes('accessor') ||
            c.slug === 'phantoms' || 
            c.slug === 'injectors' ||
            c.slug === 'cables' ||
            c.slug === 'mri-ct-accessories'
          );
          setCategories(accessoryCats);
        }
      } catch (e) { console.error(e); }
    })();
  }, []);

  // 2. Fetch Listings based on category and search query
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCat) params.append('category', currentCat);
        if (currentQ) params.append('q', currentQ);
        params.append('limit', '50');

        // If no specific category is chosen, ensure we only show accessories
        if (!currentCat && !currentQ) {
          params.append('q', 'accessories');
        }

        const res = await fetch(`${API}/listings?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setListings(data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentCat, currentQ]);

  // Update URL when search form is submitted
  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCat) params.append('category', searchCat);
    if (searchQ) params.append('q', searchQ);
    router.push(`/mri-ct-accessories?${params.toString()}`);
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 1200 }}>
      <h1 style={{ marginBottom: 8 }}>MRI / CT Accessories</h1>
      <p style={{ color: '#6b7280', marginBottom: 30 }}>Find phantoms, injectors, cables, and other accessories.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 30, alignItems: 'start' }}>
        
        {/* LEFT SIDEBAR: Categories */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16, color: '#1e293b', borderBottom: '2px solid #eee', paddingBottom: 8 }}>
            Accessory Categories
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => router.push('/mri-ct-accessories')}
              className={!currentCat ? 'side-link active' : 'side-link'}
              style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              All Accessories
            </button>

            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => router.push(`/mri-ct-accessories?category=${c.slug}`)}
                className={currentCat === c.slug ? 'side-link active' : 'side-link'}
                style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {c.name} <span className="count">({c.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Search Bar + Listings Grid */}
        <div>
          {/* SEARCH BAR & DROPDOWN */}
          <form onSubmit={handleSearch} className="card" style={{ padding: 12, marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search accessories..." 
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              style={{ flex: 1, minWidth: 200, border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: 8 }}
            />
            <select 
              value={searchCat} 
              onChange={(e) => setSearchCat(e.target.value)}
              style={{ width: 220, border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: 8 }}
            >
              <option value="">All Accessory Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <button type="submit" className="btn" style={{ padding: '10px 24px' }}>
              Search
            </button>
          </form>

          {/* LISTINGS GRID */}
          {loading ? (
            <p style={{ textAlign: 'center', padding: 40 }}>Loading listings...</p>
          ) : listings.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
              No accessories found matching your search.
            </div>
          ) : (
            <div className="grid grid-3">
              {listings.map(item => (
                <Link key={item.id} href={`/listings/${item.slug || item.id}`} className="card listing-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 180, background: '#f3f4f6' }}>
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/400x300?text=Accessory'} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#0d6efd', fontWeight: 700, marginBottom: 6 }}>
                      {item.category}
                    </div>
                    <h3 style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</h3>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                      {item.brand && <>{item.brand} · </>}
                      {item.condition_type}
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
          )}
        </div>

      </div>
    </div>
  );
}

export default function AccessoriesPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: 40 }}>Loading...</div>}>
      <AccessoriesContent />
    </Suspense>
  );
}