import Link from 'next/link';

export default function Breadcrumbs({ category, categorySlug, title }) {
  return (
    <nav style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
      <Link href="/" style={{ color: '#0d6efd' }}>Home</Link>
      <span> › </span>
      <Link href="/listings" style={{ color: '#0d6efd' }}>Equipment</Link>
      {category && (
        <>
          <span> › </span>
          <Link href={`/listings?category=${categorySlug}`} style={{ color: '#0d6efd' }}>
            {category}
          </Link>
        </>
      )}
      <span> › </span>
      <span>{title.length > 40 ? title.slice(0, 40) + '…' : title}</span>
    </nav>
  );
}