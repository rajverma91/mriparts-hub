import Link from 'next/link';

export default function SubscribeBar() {
  return (
    <div className="subscribe-bar">
      <div>
        <div style={{ fontSize: 13, color: '#c7d2fe', letterSpacing: 1, fontWeight: 600 }}>
          NEWSLETTER
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 4 }}>
          Subscribe to new ads in this category
        </div>
        <div style={{ fontSize: 13, color: '#c7d2fe', marginTop: 2 }}>
          Get the latest offers in your inbox.
        </div>
      </div>
      <Link href="/register" className="btn"
            style={{ background: '#fff', color: '#0d6efd', whiteSpace: 'nowrap' }}>
        Subscribe
      </Link>
    </div>
  );
}