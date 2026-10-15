import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <h4>MRI Parts Hub</h4>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>
            The trusted marketplace for new &amp; used medical equipment
            and MRI parts worldwide.
          </p>
        </div>

        <div>
          <h4>Company</h4>
          <Link href="/about">About us</Link>
          <Link href="/contacts">Contact</Link>
          <Link href="/news">Latest news</Link>
          <Link href="/partnership">Partnership</Link>
          <Link href="/stats">Statistics</Link>
        </div>

        <div>
          <h4>Marketplace</h4>
          <Link href="/listings">Browse listings</Link>
          <Link href="/listings?category=mri-machines">MRI Machines</Link>
          <Link href="/listings?category=mri-coils">MRI Coils</Link>
          <Link href="/listings?category=ct-scanners">CT Scanners</Link>
          <Link href="/listings?category=ultrasound-machines">Ultrasound</Link>
          <Link href="/parts">Spare parts</Link>
          <Link href="/services">Services</Link>
          <Link href="/manufacturers">Manufacturers</Link>
        </div>

        <div>
          <h4>For sellers</h4>
          <Link href="/sellers/register">Become a seller</Link>
          <Link href="/pro-account">Pro accounts</Link>
          <Link href="/sellers">Sellers directory</Link>
          <Link href="/sellers/blacklist">Blacklist</Link>
          <Link href="/dashboard">Seller dashboard</Link>
        </div>

        <div>
          <h4>Legal</h4>
          <Link href="/agreements">Terms of Service</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/sitemap">Sitemap</Link>
        </div>

        <div>
          <h4>Contact</h4>
          <a href="mailto:support@mripartshub.com">support@mripartshub.com</a>
          <a href="tel:+18583260226">+1 (858) 326-0226</a>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>
            5909 Sea Lion Pl, Suite F<br />
            Carlsbad, CA 92010
          </p>
        </div>
      </div>

      <div className="copy">
        © {new Date().getFullYear()} MRI Parts Hub. All rights reserved.
      </div>
    </footer>
  );
}