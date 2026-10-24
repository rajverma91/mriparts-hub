'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewsPage() {
  const [posts, setPosts]       = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/news`);
        if (res.ok) setPosts(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Helper to strip HTML tags (from ReactQuill) and limit to 20 words
  function getExcerpt(htmlContent) {
    if (!htmlContent) return '';
    const textOnly = htmlContent.replace(/<[^>]+>/g, ''); // Strip HTML
    const words = textOnly.trim().split(/\s+/);
    if (words.length <= 20) return textOnly;
    return words.slice(0, 20).join(' ') + '...';
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  if (loading) {
    return <div className="container" style={{ padding: 60, textAlign: 'center' }}>Loading news...</div>;
  }

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 1200 }}>
      <h1 style={{ marginBottom: 24, textAlign: 'center' }}>Latest News & Updates</h1>

      {posts.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center' }}>No news articles published yet.</p>
      ) : (
        <>
          {/* 3-Column Grid */}
          <div className="grid grid-3">
            {posts.slice(0, visibleCount).map((n) => (
              <article key={n.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Image */}
                <div style={{ height: 200, background: '#f3f4f6' }}>
                  {n.image_url ? (
                    <img 
                      src={n.image_url} 
                      alt={n.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#0d6efd', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
                    {n.category || 'Industry News'}
                  </div>
                  
                  <h3 style={{ fontSize: 18, marginBottom: 10, lineHeight: 1.4 }}>
                    <Link href={`/news/${n.slug}`} style={{ color: '#111827' }}>
                      {n.title}
                    </Link>
                  </h3>

                  <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                    {getExcerpt(n.content)}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                      {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <Link href={`/news/${n.slug}`} style={{ color: '#0d6efd', fontWeight: 600, fontSize: 14 }}>
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < posts.length && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button className="btn btn-outline" onClick={handleLoadMore} style={{ padding: '12px 30px', fontSize: 16 }}>
                Load More Articles
              </button>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <Link href="/" className="btn btn-outline">← Back to home</Link>
      </div>
    </div>
  );
}