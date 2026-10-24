import Link from 'next/link';
import { notFound } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function SingleNewsPage({ params }) {
  const res = await fetch(`${API}/news/${params.slug}`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const post = await res.json();

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 800 }}>
      <Link href="/news" style={{ color: '#0d6efd', fontSize: 14 }}>← Back to all news</Link>
      
      <div style={{ fontSize: 13, color: '#0d6efd', fontWeight: 600, marginTop: 16 }}>
        {post.category}
      </div>
      <h1 style={{ marginTop: 8, marginBottom: 8 }}>{post.title}</h1>
      
      <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
        Published on {new Date(post.created_at).toLocaleDateString()} by {post.author}
      </div>

      {post.image_url && (
        <img src={post.image_url} alt={post.title} style={{ width: '100%', borderRadius: 12, marginBottom: 24 }} />
      )}

      {/* RENDER HTML SAFELY */}
      <div 
        className="ql-editor" // Quill classes for list styles
        style={{ padding: 0, lineHeight: 1.8, color: '#374151', fontSize: 16 }}
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </div>
  );
}