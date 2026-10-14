'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken, clearToken, api } from '@/lib/api';
import BrandLogo from './BrandLogo';
import Logo from '../app/img/MRI_safe_products_Logohh.png';
import TopNav    from './TopNav';

export default function Header() {
  const [user, setUser]             = useState(null);
  const [unread, setUnread]         = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [lang, setLang]             = useState('EN');
  const [currency, setCurrency]     = useState('USD');
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    if (!t) return;
    try { setUser(JSON.parse(atob(t.split('.')[1]))); } catch {}
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [msgs, favs] = await Promise.all([
          api.get('/inquiries/mine').catch(() => []),
          api.get('/favorites/count').catch(() => ({ count: 0 }))
        ]);
        setUnread(Array.isArray(msgs) ? msgs.filter((m) => !m.is_read).length : 0);
        setSavedCount(favs.count || 0);
      } catch {}
    })();
  }, [user]);

  function logout() {
    clearToken();
    setUser(null);
    setUnread(0);
    setSavedCount(0);
    router.push('/');
  }

  return (
    <header className="site-header">

      {/* ─────────── TOP BAR (navy) ─────────── */}
      <div className="topbar">
        <div className="topbar-inner">
          {/* <BrandLogo variant="dark" /> */}
      <a href='/'>      <img 
  src={Logo.src}  // <-- Add .src here
  alt="MRI Safe Products Logo" 
  className="logoImage" // Don't forget to add a CSS class to size it!
/></a>

          <div className="topbar-right">
            {/* Language */}
            <select
              className="topbar-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Language"
            >
              <option value="EN">🇺🇸 English</option>
              <option value="DE">🇩🇪 Deutsch</option>
              <option value="FR">🇫🇷 Français</option>
              <option value="ES">🇪🇸 Español</option>
              <option value="IT">🇮🇹 Italiano</option>
            </select>

            {/* Currency */}
            <select
              className="topbar-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>

            {/* Saved listings (heart) */}
            <Link href="/account/saved" className="topbar-heart" title="Saved listings">
              <span className="heart-icon">♥</span>
              {savedCount > 0 && <span className="topbar-badge">{savedCount}</span>}
            </Link>

            {/* Inbox (only for seller/admin) */}
            {user && (user.role === 'seller' || user.role === 'admin') && (
              <Link href="/dashboard/messages" className="topbar-heart" title="Inbox">
                <span className="heart-icon" style={{ color: '#cbd5e1' }}>✉</span>
                {unread > 0 && <span className="topbar-badge">{unread}</span>}
              </Link>
            )}

            {/* Auth links */}
            {user ? (
              <div className="topbar-auth">
                <Link href="/dashboard" className="topbar-user">
                  <span className="user-icon">◉</span>
                  <span>{user.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                <button onClick={logout} className="topbar-logout">Logout</button>
              </div>
            ) : (
              <div className="topbar-auth">
                <Link href="/login" className="topbar-link">
                  <span className="user-icon">◉</span>
                  <span>Sign in</span>
                </Link>
                <Link href="/register" className="topbar-link">
                  <span className="user-icon">+</span>
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Big CTA */}
            <Link href="/dashboard/listings/new" className="btn-place-ad">
              <span className="plus">+</span> PLACE AN ADVERT
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────── SECOND ROW (white) ─────────── */}
      <TopNav />
    </header>
  );
}