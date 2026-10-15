'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/listings',         label: 'Equipment' },
  { href: '/parts',            label: 'Parts' },
  { href: '/services',         label: 'Services' },
  { href: '/sellers',          label: 'Sellers' },
  { href: '/manufacturers',    label: 'Manufacturers' },
  { href: '/pro-account',      label: 'Pro Account' },
  { href: '/sellers/register', label: 'Become a Seller' },
  { href: '/auctions',         label: 'Auctions' },
];

export default function TopNav() {
  const path = usePathname();

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        {LINKS.map((l) => {
          const base = l.href.split('?')[0];
          const isActive = path === base && !l.href.includes('?');

          return (
            <Link
              key={l.href}
              href={l.href}
              className={isActive ? 'topnav-link active' : 'topnav-link'}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}