import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Breadcrumbs      from '@/components/Breadcrumbs';
import ProductGallery   from '@/components/ProductGallery';
import SpecsTable       from '@/components/SpecsTable';
import SellerCard       from '@/components/SellerCard';
import TrustBar         from '@/components/TrustBar';
import RelatedListings  from '@/components/RelatedListings';
import ReviewsSection   from '@/components/ReviewsSection';
import ShareButtons     from '@/components/ShareButtons';
import InquiryForm      from '@/components/InquiryForm';
import SaveButton       from '@/components/SaveButton';
import SavedCountBadge  from '@/components/SavedCountBadge';
import { parseGallery } from '@/lib/parseGallery';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJson(path) {
  try {
    const r = await fetch(`${API}${path}`, { cache: 'no-store' });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

async function fetchListing(param) {
  if (/^\d+$/.test(param)) return fetchJson(`/listings/${param}`);
  return fetchJson(`/listings/by-slug/${param}`);
}

export async function generateMetadata({ params }) {
  const item = await fetchListing(params.id);
  if (!item) return { title: 'Listing not found — MRI Parts Hub' };

  // Strip HTML tags for meta description
  const plainDesc = (item.description || `${item.condition_type} ${item.category || 'equipment'} available from ${item.country || 'verified sellers'}.`)
    .replace(/<[^>]+>/g, ' ')
    .slice(0, 160);

  const title = `${item.title} — ${item.brand || 'Medical Equipment'} | MRI Parts Hub`;

  const gallery = parseGallery(item.gallery_json);
  const image = gallery[0] || item.image_url;

  return {
    title,
    description: plainDesc,
    openGraph: {
      title,
      description: plainDesc,
      images: image ? [image] : [],
      type: 'website',
      url: `https://mripartshub.com/listings/${item.slug || item.id}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: plainDesc,
      images: image ? [image] : []
    }
  };
}

export default async function ListingDetail({ params }) {
  const item = await fetchListing(params.id);
  if (!item) return notFound();

  if (/^\d+$/.test(params.id) && item.slug) {
    redirect(`/listings/${item.slug}`);
  }

  const id = Number(item.id);

  const [related, reviewData] = await Promise.all([
    fetchJson(`/listings/${id}/related`),
    fetchJson(`/reviews/listing/${id}`)
  ]);

  let images = parseGallery(item.gallery_json);
  if (!images.length && item.image_url) images = [item.image_url];

  const url = `https://mripartshub.com/listings/${item.slug || id}`;

  const isFeatured = Boolean(item.is_featured)
    && Boolean(item.featured_until)
    && new Date(item.featured_until) > new Date();

  return (
    <div className="container" style={{ padding: '24px 20px 60px' }}>
      <Breadcrumbs
        category={item.category}
        categorySlug={item.category_slug}
        title={item.title}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 30 }}>
        <div>
          <ProductGallery images={images} title={item.title} />

          <div className="card" style={{ padding: 22, marginTop: 20 }}>
            <h3 style={{ marginBottom: 10 }}>Product Description</h3>
            {/* RENDER HTML CONTENT FROM RICH TEXT EDITOR */}
            <div 
              className="ql-editor"
              style={{ padding: 0, color: '#374151', lineHeight: 1.6, fontSize: 15 }}
              dangerouslySetInnerHTML={{ __html: item.description || '<p style="color:#6b7280">No description provided.</p>' }} 
            />
          </div>

          <SpecsTable item={item} />
        </div>

        <div>
          <h1 style={{ fontSize: 28, lineHeight: 1.25, marginBottom: 8 }}>{item.title}</h1>

          {isFeatured && (
            <span className="badge featured" style={{ display: 'inline-block', marginBottom: 10 }}>
              ⭐ FEATURED
            </span>
          )}

          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            {item.category && <span className="badge">{item.category}</span>}
            <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
              {item.condition_type}
            </span>
            {item.brand && (
              <span className="badge" style={{ background: '#e0f2fe', color: '#075985' }}>
                {item.brand}
              </span>
            )}
          </div>

          <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>
            Shipping from: <b style={{ color: '#111827' }}>{item.country || '—'}</b>
            {item.city && <> · {item.city}</>}
          </div>

          <div style={{ fontSize: 32, color: '#0d6efd', fontWeight: 800, margin: '10px 0' }}>
            {item.currency} {Number(item.price || 0).toLocaleString()}
          </div>

          <div style={{ marginBottom: 10 }}>
            <SavedCountBadge listingId={id} />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <SaveButton listingId={id} variant="inline" />
            <ShareButtons url={url} title={item.title} />
          </div>

          <SellerCard seller={item} />
          <TrustBar />
          <InquiryForm listingId={id} />
        </div>
      </div>

      {related && related.length > 0 && (
        <RelatedListings
          title="Similar ads in this category"
          items={related}
          href={`/listings?category=${item.category_slug || ''}`}
        />
      )}

      <ReviewsSection listingId={id} data={reviewData} />
    </div>
  );
}