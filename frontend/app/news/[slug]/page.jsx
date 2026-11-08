import Link from 'next/link';
import { notFound } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function SingleNewsPage({ params }) {
  const res = await fetch(`${API}/news/${params.slug}`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const post = await res.json();

  // Fix any relative image paths (like "gjghjytty") to point to Cloudinary
  // This is a safety net for old posts that were saved before the fix
  let safeContent = post.content || '';
  
  // If the image src doesn't start with http, replace it with a placeholder or fix it
  safeContent = safeContent.replace(/src="(?!http)([^"]+)"/g, 'src="https://via.placeholder.com/600x400?text=Image+Missing"');

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 800 }}>
      <Link href="/news" style={{ color: '#0d6efd', fontSize: 14 }}>← Back to all news</Link>
      
      <div style={{ fontSize: 13, color: '#0d6efd', fontWeight: 600, marginTop: 16 }}>
        {post.category}
      </div>
      <h1 style={{ marginTop: 8, marginBottom: 8 }}>{post.title}</h1>
      
      <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
        Published on {new Date(post.created_at).toLocaleDateString()} by {post.author || 'Admin'}
      </div>
 
      {post.image_url && (
        <img 
          src={post.image_url.startsWith('http') ? post.image_url : `https://via.placeholder.com/800x400?text=Image`} 
          alt={post.title} 
          style={{ width: '100%', borderRadius: 12, marginBottom: 24 }} 
        />
      )}

      {/* Render the HTML content with images */}
      <div 
        className="ql-editor" 
        style={{ padding: 0, lineHeight: 1.8, color: '#374151', fontSize: 16 }}
        dangerouslySetInnerHTML={{ __html: safeContent }} 
      />
    </div>
  );
}