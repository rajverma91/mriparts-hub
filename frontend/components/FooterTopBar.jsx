'use client';
import Link from 'next/link';

const LINKS = [
   { href: '/about',           label: 'About Us' },
   { href: '/contacts',        label: 'Contacts' },
    { href: '/faq',             label: "FAQ's" },
     { href: '/news',            label: 'News/ Blogs' },
     { href: '/upcoming-events',            label: 'Upcoming Events' },
     { href: '/privacy-policy',            label: 'Privacy Policy' },

  // { href: '/stats',           label: 'Statistics' },
  // { href: '/agreements',      label: 'User Agreement' },
  // { href: '/documentation',   label: "Documentation" },
  // { href: '/sitemap',         label: 'Sitemap' },
  // { href: '/partnership',     label: 'Service Partnership' },
  // { href: '/sellers/register',label: 'Become a Partner' },
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