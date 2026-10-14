import Link from 'next/link';

export default function BrandLogo({ variant = 'light' }) {
  const primary = variant === 'dark' ? '#ffffff' : '#0d6efd';
  const secondary = variant === 'dark' ? '#93c5fd' : '#111827';

  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <circle cx="17" cy="17" r="15" fill="none" stroke={primary} strokeWidth="2.5" opacity="0.85" />
        <circle cx="17" cy="17" r="9"  fill="none" stroke={primary} strokeWidth="2.5" opacity="0.55" />
        <circle cx="17" cy="17" r="3"  fill={primary} />
      </svg>
      <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: -0.3 }}>
        <span style={{ color: primary }}>MRI</span>
        <span style={{ color: secondary }}>Parts</span>
        <span style={{ color: primary }}>Hub</span>
      </span>
    </Link>
  );
}