import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function UpcomingEventsPage() {
  const res = await fetch(`${API}/news`, { cache: 'no-store' });
  const allPosts = res.ok ? await res.json() : [];
  
  // Filter only posts where the category is "Upcoming Events"
  const events = allPosts.filter((n) => n.category === 'Upcoming Events');

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 1200 }}>
      <h1 style={{ marginBottom: 24, textAlign: 'center' }}>Upcoming Events</h1>

      {events.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center' }}>No events scheduled at this time.</p>
      ) : (
        <div className="grid grid-3">
          {events.map((n) => (
            <article key={n.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 200, background: '#f3f4f6' }}>
                {n.image_url ? (
                  <img src={n.image_url} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    No Image
                  </div>
                )}
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: 12, color: '#0d6efd', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
                  {n.category}
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 10, lineHeight: 1.4 }}>
                  <Link href={`/news/${n.slug}`} style={{ color: '#111827' }}>
                    {n.title}
                  </Link>
                </h3>
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
      )}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/" className="btn btn-outline">← Back to home</Link>
      </div>
    </div>
  );
}