'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken, clearToken, api } from '@/lib/api';
import TopNav from './TopNav';
import Logo from '../app/img/MRI_safe_products_Logohh.png';

export default function Header() {
  const [user, setUser]               = useState(null);
  const [savedCount, setSavedCount]   = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname(); // ← ADDED: Tracks route changes

  // 1. Check token whenever the page changes
  useEffect(() => {
    const t = getToken();
    if (!t) {
      setUser(null);
      setSavedCount(0);
      setUnreadCount(0);
      return;
    }
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      setUser(payload);
    } catch {
      setUser(null);
    }
  }, [pathname]); // ← ADDED: Runs on every navigation

  // 2. Fetch counts when user logs in
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [favs, msgs] = await Promise.all([
          api.get('/favorites/count').catch(() => ({ count: 0 })),
          api.get('/inquiries/mine').catch(() => [])
        ]);
        setSavedCount(favs.count || 0);
        setUnreadCount(Array.isArray(msgs) ? msgs.filter((m) => !m.is_read).length : 0);
      } catch {}
    })();
  }, [user]);

  function logout() {
    clearToken();
    setUser(null);
    setSavedCount(0);
    setUnreadCount(0);
    router.push('/');
  }

  return (
    <header className="site-header">
      {/* ═══════ TOP TIER (navy) ═══════ */}
      <div className="hdr-top">
        <div className="hdr-top-inner">

          {/* Logo */}
          <div className="hdr-logo">
            <Link href="/">
              <img src={Logo.src} alt="MRI Safe Products Logo" className="logoImage" />
            </Link>
          </div>

          {/* Right-side controls */}
          <div className="hdr-controls">

            {/* Language */}
            <button type="button" className="hdr-select" aria-label="Language">
              <span className="hdr-flag">🇺🇸</span>
              <span>English</span>
              <svg className="hdr-caret" width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </button>

            {/* Currency */}
            <button type="button" className="hdr-select" aria-label="Currency">
              <span>USD</span>
              <svg className="hdr-caret" width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </button>

            {/* Saved heart */}
            <Link href="/account/saved" className="hdr-heart" aria-label="Saved listings">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7.5-4.6-9.7-9.5C.6 8 2.6 4 6.4 4c2.2 0 3.6 1.2 4.5 2.5l1.1 1.5 1.1-1.5C14 5.2 15.4 4 17.6 4c3.8 0 5.8 4 4.1 7.5-2.2 4.9-9.7 9.5-9.7 9.5z" />
              </svg>
              {savedCount > 0 && <span className="hdr-badge">{savedCount}</span>}
            </Link>

            {/* Auth Section */}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hdr-action">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    Admin
                  </Link>
                )}

                <Link href="/dashboard" className="hdr-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {user.name?.split(' ')[0] || 'Account'}
                </Link>

                <button onClick={logout} className="hdr-action hdr-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hdr-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Sign in
                </Link>

                <Link href="/register" className="hdr-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  Register
                </Link>
              </>
            )}

            {/* Yellow CTA */}
            <Link href="/dashboard/listings/new" className="hdr-cta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              PLACE AN ADVERT
            </Link>

          </div>
        </div>
      </div>

      {/* ═══════ SECOND TIER (white) ═══════ */}
      <TopNav />
    </header>
  );
}