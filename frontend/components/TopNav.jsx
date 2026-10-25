'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const LINKS = [
  { 
    label: 'MRI Parts', 
    href: '/mri-parts',
    dropdown: [
      { label: 'MRI Coils', href: '/listings?category=mri-coils' },
      { label: 'Gradients', href: '/listings?category=gradients' },
      { label: 'RF Amplifiers', href: '/listings?category=rf-amplifiers' },
    ]
  },
  { 
    label: 'CT Parts', 
    href: '/ct-parts',
    dropdown: [
      { label: 'CT Tubes', href: '/listings?category=ct-tubes' },
      { label: 'Detectors', href: '/listings?category=detectors' },
    ]
  },
  { 
    label: 'MRI/CT Accessories', 
    href: '/mri-ct-accessories',
    dropdown: [
      { label: 'Phantoms', href: '/listings?category=phantoms' },
      { label: 'Injectors', href: '/listings?category=injectors' },
    ]
  },
  { 
    label: 'MRI Safety Products', 
    href: '/mri-safety-products',
    dropdown: [
      { label: 'Warning Signs', href: '/listings?category=warning-signs' },
      { label: 'Ferromagnetic Detectors', href: '/listings?category=ferromagnetic-detectors' },
    ]
  },
  { 
    label: 'Services', 
    href: '/services',
    dropdown: [
      { label: 'MRI Part Repair', href: '/services' },
      { label: 'MRI Deinstall & Install', href: '/services' },
      { label: 'MRI Rental', href: '/services' },
    ]
  },
  { label: 'Membership Plans', href: '/membership-plans' },
  { 
    label: 'Directory', 
    href: '/directory',
    dropdown: [] // This will be populated dynamically
  },
  { label: "FAQ's", href: '/faq' },
  { label: 'News & Blog', href: '/news' },
  { label: 'Upcoming Events', href: '/upcoming-events' },
];

export default function TopNav() {
  const path = usePathname();
  const [openKey, setOpenKey] = useState(null);
  const [directoryCats, setDirectoryCats] = useState([]);
  const navRef = useRef(null);

  // Fetch dynamic directory categories
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/directory/categories`);
        if (r.ok) setDirectoryCats(await r.json());
      } catch {}
    })();

    // Close dropdown on outside click
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenKey(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inject dynamic categories into the Directory dropdown
  const linksWithDynamic = LINKS.map((link) => {
    if (link.label === 'Directory') {
      return {
        ...link,
        dropdown: directoryCats.map((cat) => ({
          label: cat,
          href: `/directory?category=${encodeURIComponent(cat)}`,
        })),
      };
    }
    return link;
  });

  return (
    <nav className="hdr-nav" ref={navRef}>
      <div className="hdr-nav-inner">
        {linksWithDynamic.map((l) => {
          const base = l.href.split('?')[0];
          const isActive = path === base;
          const hasDropdown = l.dropdown && l.dropdown.length > 0;
          const isOpen = openKey === l.label;

          return (
            <div 
              key={l.href} 
              className="nav-item-wrapper"
              onMouseEnter={() => hasDropdown && setOpenKey(l.label)}
              onMouseLeave={() => setOpenKey(null)}
            >
              <Link
                href={l.href}
                className={`hdr-nav-link ${isActive ? 'active' : ''} ${hasDropdown ? 'has-dropdown' : ''}`}
              >
                {l.label}
                {hasDropdown && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: 4 }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
              </Link>

              {/* Dropdown Menu */}
              {hasDropdown && isOpen && (
                <div className="nav-dropdown">
                  {l.dropdown.map((item) => (
                    <Link key={item.href} href={item.href} className="nav-dropdown-item">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}