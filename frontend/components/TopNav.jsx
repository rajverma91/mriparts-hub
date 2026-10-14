'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/listings',                                 label: 'Equipment' },
  { href: '/listings?view=models',                     label: 'Models' },
  { href: '/listings?category=mri-parts-accessories',  label: 'Parts' },
  { href: '/services',                                 label: 'Services' },
  { href: '/sellers',                                  label: 'Sellers' },
  { href: '/sellers-blacklist',                        label: 'Sellers blacklist' },
  { href: '/partners',                                 label: 'Become a partner' },
  { href: '/tariffs',                                  label: 'Tariffs' },
  { href: '/manufacturers',                            label: 'Manufacturers' },
  { href: '/for-manufacturers',                        label: 'For Manufacturers' },
  { href: '/auctions',                                 label: 'Auctions' },
];

export default function TopNav() {
  const path = usePathname();

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={path === l.href ? 'topnav-link active' : 'topnav-link'}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}