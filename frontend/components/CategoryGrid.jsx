'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Curated dropdown items — top of the list shows real, well-defined categories.
// Feel free to extend or reorder.
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
  const [subs, setSubs]       = useState({});
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/categories`);
        if (r.ok) setCategories(await r.json());
      } catch {}
    })();
  }, []);

  // For each dropdown, we'll show: real categories first, then curated subcategories.
  // In a real app you'd fetch real subcategories per parent; here we synthesize
  // a list of brands + a few common terms so it feels populated.
  async function openGroup(group) {
    setOpenKey(group.key === openKey ? null : group.key);

    if (subs[group.key]) return; // already loaded

    try {
      const [brandsRes] = await Promise.all([
        fetch(`${API}/brands`).then((r) => r.ok ? r.json() : [])
      ]);
      const items = [
        ...categories.map((c) => ({ type: 'category', label: c.name, href: `/listings?category=${c.slug}` })),
        ...brandsRes.map((b) => ({ type: 'brand', label: b.name, href: `/listings?brand=${encodeURIComponent(b.name)}` }))
      ];
      setSubs((s) => ({ ...s, [group.key]: items.slice(0, 12) }));
    } catch {
      setSubs((s) => ({ ...s, [group.key]: [] }));
    }
  }

  return (
    <div className="cat-grid">
      {GROUPS.map((g) => {
        const isOpen = openKey === g.key;
        const items  = subs[g.key] || [];

        return (
          <div key={g.key} className={`cat-cell ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="cat-btn"
              onClick={() => openGroup(g)}
            >
              <span>{g.label}</span>
              <span className="cat-caret">{isOpen ? '▴' : '▾'}</span>
            </button>

            {isOpen && (
              <div className="cat-dropdown">
                {items.length === 0 && (
                  <div className="cat-empty">Loading…</div>
                )}
                {items.map((it, i) => (
                  <a
                    key={i}
                    href={it.href}
                    className="cat-item"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(it.href);
                      setOpenKey(null);
                    }}
                  >
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