export const dynamic = 'force-dynamic';
export const revalidate = 0;
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard',        label: '📋 My Listings' },
  { href: '/account/saved',    label: '♥ Saved' },
  { href: '/dashboard/messages', label: '✉️ Inbox' },
];

export default function AccountLayout({ children }) {
  const path = usePathname();

  return (
    <div className="container" style={{ padding: '24px 20px 60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        <aside>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: '#6b7280' }}>
              MY ACCOUNT
            </div>
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={path === t.href ? 'side-link active' : 'side-link'}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}