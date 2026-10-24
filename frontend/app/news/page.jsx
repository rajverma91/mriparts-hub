import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function NewsPage() {
  // Fetch news from backend
  const res = await fetch(`${API}/news`, { cache: 'no-store' });
  const posts = res.ok ? await res.json() : [];

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 820 }}>
      <h1 style={{ marginBottom: 24 }}>Latest news</h1>

      {posts.length === 0 && (
        <p style={{ color: '#6b7280' }}>No news articles published yet.</p>
      )}

      {posts.map((n) => (
        <article key={n.id} className="card" style={{ padding: 22, marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            {new Date(n.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h3 style={{ marginTop: 6, marginBottom: 6 }}>
            <Link href={`/news/${n.slug}`} style={{ color: '#0d6efd' }}>
              {n.title}
            </Link>
          </h3>
          <p style={{ color: '#374151', lineHeight: 1.7 }}>
            {n.content.substring(0, 150)}...
          </p>
          <Link href={`/news/${n.slug}`} style={{ color: '#0d6efd', fontWeight: 600 }}>
            Read more →
          </Link>
        </article>
      ))}

      <Link href="/" className="btn btn-outline" style={{ marginTop: 20 }}>← Back to home</Link>
    </div>
  );
}