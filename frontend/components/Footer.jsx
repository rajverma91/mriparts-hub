export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <h4>MRI Parts Hub</h4>
          <p style={{fontSize:14,color:'#9ca3af'}}>
            The trusted marketplace for new & used medical equipment and MRI parts worldwide.
          </p>
        </div>
        <div>
          <h4>Marketplace</h4>
          <a href="/listings">Browse Listings</a>
          <a href="/listings?category=mri-machines">MRI Machines</a>
          <a href="/listings?category=mri-coils">MRI Coils</a>
          <a href="/listings?category=ct-scanners">CT Scanners</a>
        </div>
        <div>
          <h4>Sellers</h4>
          <a href="/register">Become a Seller</a>
          <a href="/dashboard">Seller Dashboard</a>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:support@mripartshub.com">support@mripartshub.com</a>
          <a href="tel:+18583260226">+1 (858) 326-0226</a>
          <p style={{fontSize:13,color:'#9ca3af',marginTop:8}}>
            5909 Sea Lion Pl, Suite F<br/>Carlsbad, CA 92010
          </p>
        </div>
      </div>
      <div className="copy">© {new Date().getFullYear()} MRI Parts Hub. All rights reserved.</div>
    </footer>
  );
}