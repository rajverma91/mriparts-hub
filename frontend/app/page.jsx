import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ListingCard from '@/components/ListingCard';
import CategoryGrid from '@/components/CategoryGrid';
import MedicalEquipment from '@/components/MedicalEquipment';
import AuctionBanner from '@/components/AuctionBanner';
import WhatIsBimedis from '@/components/WhatIsBimedis';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getListings(params = '') {
  try {
    const res = await fetch(`${API}/listings?${params}`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return res.json();
  } catch {
    return { data: [] };
  }
}

// Reusable component for listing sections
function ListingSection({ title, subtitle, link, items, bg = '#fff' }) {
  if (!items || items.length === 0) return null;

  return (
    <section style={{ background: bg, padding: '60px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', margin: 0 }}>{title}</h2>
            {subtitle && <p style={{ color: '#6b7280', marginTop: 6, fontSize: 15 }}>{subtitle}</p>}
          </div>
          <Link href={link} className="btn btn-outline" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 14 }}>
            View All →
          </Link>
        </div>
        
        <div className="grid grid-4">
          {items.map((item) => <ListingCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [latest, mri, ct, us] = await Promise.all([
    getListings('limit=8'),
    getListings('category=mri-machines&limit=4'),
    getListings('category=ct-scanners&limit=4'),
    getListings('category=ultrasound-machines&limit=4'),
  ]);

  // Featured only
  const featured = await getListings('limit=4');
  const featuredItems = (featured.data || []).filter(
    (it) => it.is_featured && it.featured_until && new Date(it.featured_until) > new Date()
  );

  return (
    <>
      <MedicalEquipment />

      {/* HERO SECTION */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)', 
        padding: '60px 20px', 
        textAlign: 'center',
        color: '#fff'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24, letterSpacing: '-0.5px' }}>
            WHAT ARE YOU LOOKING FOR?
          </h1>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section style={{ padding: '60px 0', background: '#f8fafc' }}>
        <div className="container">
          <CategoryGrid />
        </div>
      </section>

      <AuctionBanner />

      {/* FEATURED LISTINGS */}
      {featuredItems.length > 0 && (
        <ListingSection 
          title="⭐ Featured Listings" 
          subtitle="Premium equipment from verified sellers"
          link="/listings?sort=newest" 
          items={featuredItems}
          bg="#fff" 
        />
      )}

      {/* MRI MACHINES */}
      <ListingSection 
        title="MRI Machines" 
        subtitle="High-field and low-field scanners from top brands"
        link="/listings?category=mri-machines" 
        items={mri.data || []}
        bg="#f8fafc" 
      />

      {/* CT SCANNERS */}
      <ListingSection 
        title="CT Scanners" 
        subtitle="Multi-slice and cone-beam CT systems"
        link="/listings?category=ct-scanners" 
        items={ct.data || []}
        bg="#fff" 
      />

      {/* ULTRASOUND */}
      <ListingSection 
        title="Ultrasound Machines" 
        subtitle="Cart-based and portable ultrasound systems"
        link="/listings?category=ultrasound-machines" 
        items={us.data || []}
        bg="#f8fafc" 
      />

      {/* LATEST LISTINGS */}
      <ListingSection 
        title="Latest Listings" 
        subtitle="Freshly posted equipment from sellers worldwide"
        link="/listings" 
        items={latest.data || []}
        bg="#fff" 
      />

      <WhatIsBimedis />
    </>
  );
}