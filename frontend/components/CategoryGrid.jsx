'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CategoryGrid() {
  const [openKey, setOpenKey] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const gridRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch(`${API}/categories`),
          fetch(`${API}/brands`)
        ]);

        if (catRes.ok) {
          const cats = await catRes.json();
          // Only show categories that have active listings
          setCategories(cats.filter(c => c.count > 0));
        }
        
        if (brandRes.ok) {
          setBrands(await brandRes.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    // Close dropdown if clicking outside
    function handleClickOutside(event) {
      if (gridRef.current && !gridRef.current.contains(event.target)) {
        setOpenKey(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Loading categories...</div>;
  }

  return (
    <div className="modern-cat-grid" ref={gridRef}>
      {categories.map((cat) => {
        const isOpen = openKey === cat.id;
        
        // Get brands that belong to this category (we'll just show all brands for simplicity, 
        // or you can filter them if you have a brand_category table)
        const relatedBrands = brands.slice(0, 5); 

        return (
          <div key={cat.id} className={`modern-cat-cell ${isOpen ? 'open' : ''}`}>
            <button type="button" className="modern-cat-btn" onClick={() => setOpenKey(isOpen ? null : cat.id)}>
              <span className="modern-cat-label">{cat.name}</span>
              <svg 
                className={`modern-cat-icon ${isOpen ? 'rotate' : ''}`} 
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isOpen && (
              <div className="modern-cat-dropdown">
                {/* Show link to view all in this category */}
                <a
                  href={`/listings?category=${cat.slug}`}
                  className="modern-cat-item"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/listings?category=${cat.slug}`);
                    setOpenKey(null);
                  }}
                  style={{ fontWeight: 700, color: '#0d6efd' }}
                >
                  <span className="modern-cat-dot"></span>
                  View all {cat.name} ({cat.count})
                </a>

                <div style={{ height: 1, background: '#eee', margin: '4px 0' }}></div>

                {/* Show brands as sub-items */}
                {relatedBrands.map((b) => (
                  <a
                    key={b.id}
                    href={`/listings?brand=${encodeURIComponent(b.name)}`}
                    className="modern-cat-item"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/listings?brand=${encodeURIComponent(b.name)}`);
                      setOpenKey(null);
                    }}
                  >
                    <span className="modern-cat-dot"></span>
                    {b.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}