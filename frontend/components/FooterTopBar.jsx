'use client';
import Link from 'next/link';

const LINKS = [
  { href: '/stats',           label: 'Statistics' },
  { href: '/agreements',      label: 'User Agreement' },
  { href: '/faq',             label: "FAQ's" },
  { href: '/documentation',   label: "Documentation" },
  { href: '/sitemap',         label: 'Sitemap' },
  { href: '/about',           label: 'About Us' },
  { href: '/contacts',        label: 'Contacts' },
  { href: '/news',            label: 'News' },
  { href: '/partnership',     label: 'Service Partnership' },
  { href: '/sellers/register',label: 'Become a Partner' },
];

export default function FooterTopBar() {
  return (
    <div className="footer-topbar">
      <div className="footer-topbar-inner">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="footer-topbar-link">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}