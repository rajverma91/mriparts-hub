'use client';
import Link from 'next/link';
import Logo from '../app/img/MRI_safe_products_Logohh.png';

const LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/contacts', label: 'Contact Us' },
  { href: '/faq', label: "FAQ's" },
  { href: '/news', label: 'News & Blog' },
  { href: '/upcoming-events', label: 'Upcoming Events' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
];

const CATEGORIES = [
  { href: '/listings?category=mri-machines', label: 'MRI Machines' },
  { href: '/listings?category=ct-scanners', label: 'CT Scanners' },
  { href: '/listings?category=ultrasound-machines', label: 'Ultrasound' },
  { href: '/listings?category=mri-coils', label: 'MRI Coils' },
  { href: '/listings?category=mri-parts-accessories', label: 'Spare Parts' },
];

const SOCIALS = [
  { name: 'Facebook', href: 'https://facebook.com', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>
  )},
  { name: 'Twitter', href: 'https://twitter.com', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.6 8.6 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.3 3.9A12.15 12.15 0 0 1 3.05 4.8a4.28 4.28 0 0 0 1.32 5.72 4.24 4.24 0 0 1-1.94-.54v.06a4.28 4.28 0 0 0 3.43 4.2 4.28 4.28 0 0 1-1.93.07 4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 18.98 12.14 12.14 0 0 0 8.29 21c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.02-.53A8.3 8.3 0 0 0 22.46 6z"/></svg>
  )},
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.6v8.6zM7 8.6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18.3 18.3h-2.6v-4.5c0-1.1-.4-1.8-1.4-1.8-.8 0-1.2.5-1.4 1a2 2 0 0 0-.1.7v4.6h-2.6V9.7h2.6v1.1c.3-.5 1-1.3 2.5-1.3 1.8 0 3 1.2 3 3.7v5.1z"/></svg>
  )},
  { name: 'Instagram', href: 'https://instagram.com', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.8.3 2.2.5.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.5 1 .5 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.3 1.8-.5 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .5-2.2.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.8-.3-2.2-.5a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.5-1-.5-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c0-1.2.3-1.8.5-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.5 2.2-.5C8.4 2.2 8.8 2.2 12 2.2zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.9-11.2a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z"/></svg>
  )},
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', fontSize: 14 }}>
      
      {/* 1. Newsletter Banner */}
      <div style={{ borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ padding: '40px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Subscribe to our newsletter</h3>
            <p style={{ margin: 0, color: '#94a3b8' }}>Get the latest medical equipment listings and industry news.</p>
          </div>
          <form style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 400 }} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: 'none', background: '#1e293b', color: '#fff', outline: 'none' }} 
            />
            <button className="btn" style={{ padding: '12px 24px', borderRadius: 8, background: '#0d6efd', color: '#fff' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="container" style={{ padding: '60px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
        
        {/* Column 1: Brand */}
        <div>
          <img src={Logo.src} alt="MRI Safe Products" style={{ width: 200, marginBottom: 20 }} />
          <p style={{ lineHeight: 1.7, marginBottom: 24, color: '#cbd5e1' }}>
            The trusted marketplace for new & used medical imaging equipment. We connect verified sellers with buyers worldwide.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {SOCIALS.map((s) => (
              <a 
                key={s.name} 
                href={s.href} 
                target="_blank" 
                rel="noreferrer"
                aria-label={s.name}
                style={{ width: 38, height: 38, borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#0d6efd'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#cbd5e1'; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Categories</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
            {CATEGORIES.map((c) => (
              <li key={c.href}>
                <Link href={c.href} style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact */}
  <div>
  <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Contact Us</h4>
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
    
    {/* WhatsApp Link */}
    <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <span style={{ color: '#25D366' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </span>
      <a href="https://wa.me/8582083188" target="_blank" rel="noreferrer" style={{ color: '#cbd5e1' }}>(858) 208-3188</a>
    </li>

    {/* Email Link */}
    <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <span style={{ color: '#0d6efd' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
      </span>
      <a href="mailto:support@mripartshub.com" style={{ color: '#cbd5e1' }}>support@mripartshub.com</a>
    </li>
  </ul>
</div>

      </div>

      {/* 3. Bottom Bar */}
      <div style={{ borderTop: '1px solid #1e293b', padding: '24px 20px' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>© {year} MRI Parts Hub. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/privacy-policy" style={{ color: '#64748b' }}>Privacy Policy</Link>
            <Link href="/agreements" style={{ color: '#64748b' }}>Terms of Service</Link>
            <Link href="/sitemap" style={{ color: '#64748b' }}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}