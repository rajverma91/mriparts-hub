'use client';
import Link from 'next/link';
import FooterTopBar from './FooterTopBar';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-site">
      {/* Utility row: uppercase links */}
      <FooterTopBar />

      {/* Dark section with social + contact */}
      <div className="footer-dark">
        <div className="footer-dark-inner">

          {/* Social icons */}
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="footer-social-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.6 8.6 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.3 3.9A12.15 12.15 0 0 1 3.05 4.8a4.28 4.28 0 0 0 1.32 5.72 4.24 4.24 0 0 1-1.94-.54v.06a4.28 4.28 0 0 0 3.43 4.2 4.28 4.28 0 0 1-1.93.07 4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 18.98 12.14 12.14 0 0 0 8.29 21c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.02-.53A8.3 8.3 0 0 0 22.46 6z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.6v8.6zM7 8.6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18.3 18.3h-2.6v-4.5c0-1.1-.4-1.8-1.4-1.8-.8 0-1.2.5-1.4 1a2 2 0 0 0-.1.7v4.6h-2.6V9.7h2.6v1.1c.3-.5 1-1.3 2.5-1.3 1.8 0 3 1.2 3 3.7v5.1z"/>
              </svg>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest" className="footer-social-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9.2-.8 1.2-5.2 1.2-5.2s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.4.1.1.1.2.1.3l-.3 1.1c0 .2-.1.3-.3.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.6c-.2.9-.9 2.1-1.4 2.8a10 10 0 0 0 15.8-8.3A10 10 0 0 0 12 2z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.8.3 2.2.5.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.5 1 .5 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.3 1.8-.5 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .5-2.2.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.8-.3-2.2-.5a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.5-1-.5-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c0-1.2.3-1.8.5-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.5 2.2-.5C8.4 2.2 8.8 2.2 12 2.2zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.9-11.2a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z"/>
              </svg>
            </a>
          </div>

          {/* Contact row */}
          <div className="footer-contacts">
            <a href="mailto:support@mripartshub.com" className="footer-contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 7l9 6 9-6"/>
              </svg>
              support@mripartshub.com
            </a>
            <a href="tel:+18583260226" className="footer-contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.4a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z"/>
              </svg>
              +1 (858) 326-0226
            </a>
            <span className="footer-contact">
              <span style={{ fontSize: 18 }}>🇺🇸</span>
              USA
            </span>
          </div>

        </div>
      </div>

      {/* Bottom: copyright bar */}
      <div className="footer-bottom">
        <span>MRI Parts Hub © 2026–{year}</span>
      </div>
    </footer>
  );
}