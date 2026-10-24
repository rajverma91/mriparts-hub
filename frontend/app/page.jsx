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
        <section className="hero">
        <div className="container">
          <h1>WHAT ARE YOU LOOKING FOR?</h1>
          <SearchBar />
        </div>
      </section>

      {/* <div className="container">
        <div className="trust">
          <div>Free Delivery from $50</div>
          <div>99% Positive Feedbacks</div>
          <div>365 days free return</div>
          <div>Payment Secure System</div>
          <div>Only Best Brands</div>
        </div>
      </div> */}
 <section className="section container">
        <CategoryGrid />
      </section>
      <AuctionBanner />
      {featuredItems.length > 0 && (
        <section className="section container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24 }}>⭐</span> Featured listings
            </h2>
            <Link href="/listings?sort=newest" className="btn btn-outline" style={{ padding: '6px 14px' }}>
              View all
            </Link>
          </div>
          <div className="grid grid-4" style={{ marginTop: 16 }}>
            {featuredItems.map((i) => <ListingCard key={i.id} item={i} />)}
          </div>
        </section>
      )}

      <section className="section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Featured MRI Machines</h2>
          <Link href="/listings?category=mri-machines" className="btn btn-outline" style={{ padding: '6px 14px' }}>View all</Link>
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          {mri.data?.length ? mri.data.map((i) => <ListingCard key={i.id} item={i} />) : <p>No listings yet.</p>}
        </div>
      </section>

      <section className="section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>CT Scanners</h2>
          <Link href="/listings?category=ct-scanners" className="btn btn-outline" style={{ padding: '6px 14px' }}>View all</Link>
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          {ct.data?.length ? ct.data.map((i) => <ListingCard key={i.id} item={i} />) : <p>No listings yet.</p>}
        </div>
      </section>

      <section className="section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>MRI Machines</h2>
          <Link href="/listings?category=ultrasound-machines" className="btn btn-outline" style={{ padding: '6px 14px' }}>View all</Link>
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          {us.data?.length ? us.data.map((i) => <ListingCard key={i.id} item={i} />) : <p>No listings yet.</p>}
        </div>
      </section>

      <section className="section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Latest Listings</h2>
          <Link href="/listings" className="btn btn-outline" style={{ padding: '6px 14px' }}>View all</Link>
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          {latest.data?.length ? latest.data.map((i) => <ListingCard key={i.id} item={i} />) : <p>No listings yet. Be the first seller!</p>}
        </div>
      </section>
      <WhatIsBimedis />
    </>
  );
}