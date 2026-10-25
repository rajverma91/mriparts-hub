'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  // { href: '/listings',            label: 'Equipment' },
  // { href: '/listings?view=models',label: 'Models' },
  { href: '/mri-parts',           label: 'MRI Parts' },
  { href: '/ct-parts',            label: 'CT Parts' },
  { href: '/mri-ct-Accessories',            label: 'MRI/CT Accessories' },
  { href: '/mri-safety-products',            label: 'MRI Safety Products' },
  { href: '/services',            label: 'Services' },
  // { href: '/sellers',             label: 'Sellers Catalog' },
  // { href: '/sellers/blacklist',   label: 'Sellers blacklist' },
  // { href: '/partnership',         label: 'Become a partner' },
  { href: '/membership-plans',         label: 'Membership Plans' },
  { href: '/directory',         label: 'Directory' },
  { href: '/faq', label: "FAQ's" },
  { href: '/news',             label: 'News & Blog' },       // ← Added
  { href: '/upcoming-events',  label: 'Upcoming Events' },
  // { href: '/manufacturers',       label: 'Manufacturers' },
  // { href: '/sellers/register',    label: 'For Manufacturers' },
  // { href: '/auctions',            label: 'Auctions' },
];

export default function TopNav() {
  const path = usePathname();

  return (
    <nav className="hdr-nav">
      <div className="hdr-nav-inner">
        {LINKS.map((l) => {
          const base = l.href.split('?')[0];
          const isActive = path === base && !l.href.includes('?');

          return (
            <Link
              key={l.href}
              href={l.href}
              className={isActive ? 'hdr-nav-link active' : 'hdr-nav-link'}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}