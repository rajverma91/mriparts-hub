'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const GROUPS = [
  { key: 'anesthesia', label: 'Anesthesia Equipment/ICU' },
  { key: 'cardiology', label: 'Cardiology Equipment' },
  { key: 'cosmetology', label: 'Cosmetology equipment' },
  { key: 'dental', label: 'Dental Equipment' },
  { key: 'dental-lab', label: 'Dental Lab Equipment' },
  { key: 'emt', label: 'Emt training' },
  { key: 'endoscopy', label: 'Endoscopy Equipment' },
  { key: 'ent', label: 'ENT Equipment' },
  { key: 'healthcare-it', label: 'Healthcare IT, Telemedicine' },
  { key: 'home-care', label: 'Home Care Rehab' },
  { key: 'hospital', label: 'Hospital Equipment' },
  { key: 'imaging', label: 'Imaging' },
  { key: 'laboratory', label: 'Laboratory Equipment' },
  { key: 'consumables', label: 'Medical Consumable Supplies' },
  { key: 'software', label: 'Medical Software and Healthcare IT' },
  { key: 'mobile-clinics', label: 'Mobile Clinics' },
  { key: 'neurology', label: 'Neurology Equipment' },
  { key: 'obgyn', label: 'OB GYN Equipment' },
  { key: 'ophthalmic', label: 'Ophthalmic Equipment' },
  { key: 'pediatric', label: 'Pediatric equipment' },
  { key: 'physiotherapy', label: 'Physiotherapy Equipment' },
  { key: 'sterilising', label: 'Sterilising Equipment' },
  { key: 'surgery', label: 'Surgery Equipment' },
  { key: 'urology', label: 'Urology equipment' },
  { key: 'veterinary', label: 'Veterinary Equipment' },
  { key: 'wellness', label: 'Wellness or Fitness Devices' },
];

export default function CategoryGrid() {
  const [openKey, setOpenKey] = useState(null);
  const [subs, setSubs] = useState({});
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const gridRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/categories`);
        if (r.ok) setCategories(await r.json());
      } catch {}
    })();

    // Close dropdown if clicking outside
    function handleClickOutside(event) {
      if (gridRef.current && !gridRef.current.contains(event.target)) {
        setOpenKey(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function openGroup(group) {
    setOpenKey(group.key === openKey ? null : group.key);

    if (subs[group.key]) return;

    try {
      const brandsRes = await fetch(`${API}/brands`).then((r) => (r.ok ? r.json() : []));
      const items = [
        ...categories.map((c) => ({ type: 'category', label: c.name, href: `/listings?category=${c.slug}` })),
        ...brandsRes.map((b) => ({ type: 'brand', label: b.name, href: `/listings?brand=${encodeURIComponent(b.name)}` })),
      ];
      setSubs((s) => ({ ...s, [group.key]: items.slice(0, 12) }));
    } catch {
      setSubs((s) => ({ ...s, [group.key]: [] }));
    }
  }

  return (
    <div className="modern-cat-grid" ref={gridRef}>
      {GROUPS.map((g) => {
        const isOpen = openKey === g.key;
        const items = subs[g.key] || [];

        return (
          <div key={g.key} className={`modern-cat-cell ${isOpen ? 'open' : ''}`}>
            <button type="button" className="modern-cat-btn" onClick={() => openGroup(g)}>
              <span className="modern-cat-label">{g.label}</span>
              <svg 
                className={`modern-cat-icon ${isOpen ? 'rotate' : ''}`} 
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isOpen && (
              <div className="modern-cat-dropdown">
                {items.length === 0 && <div className="modern-cat-loading">Loading...</div>}
                {items.map((it, i) => (
                  <a
                    key={i}
                    href={it.href}
                    className="modern-cat-item"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(it.href);
                      setOpenKey(null);
                    }}
                  >
                    <span className="modern-cat-dot"></span>
                    {it.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}