import Link from 'next/link';

export const metadata = {
  title: 'User Guide — MRI Parts Hub',
  description: 'How to buy and sell medical equipment on MRI Parts Hub.',
};

export default function DocumentationPage() {
  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8, color: '#1e293b' }}>User Guide</h1>
      <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 40 }}>
        Everything you need to know to buy and sell on MRI Parts Hub.
      </p>

      {/* Table of Contents */}
      <div className="card" style={{ padding: 24, marginBottom: 40, background: '#f8fafc' }}>
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>What do you want to do?</h3>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2, color: '#0d6efd' }}>
          <li><a href="#create-account" style={{ color: 'inherit' }}>1. Create an Account</a></li>
          <li><a href="#buying" style={{ color: 'inherit' }}>2. How to Buy Equipment (Buyers)</a></li>
          <li><a href="#selling" style={{ color: 'inherit' }}>3. How to Sell Equipment (Sellers)</a></li>
          <li><a href="#featured" style={{ color: 'inherit' }}>4. How to Feature a Listing</a></li>
          <li><a href="#faq" style={{ color: 'inherit' }}>5. Frequently Asked Questions</a></li>
        </ul>
      </div>

      {/* 1. Create Account */}
      <section id="create-account" style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          1. Create an Account
        </h2>
        <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
          You can browse listings without an account, but you need one to save items, contact sellers, or sell equipment.
        </p>
        <ol style={{ paddingLeft: 20, color: '#374151', lineHeight: 2 }}>
          <li>Click the <b>Register</b> button in the top-right corner.</li>
          <li>Enter your Name, Email, and a Password (at least 6 characters).</li>
          <li>Choose whether you want to <b>Buy equipment</b> or <b>Sell equipment</b>.</li>
          <li>Click <b>Sign up</b>.</li>
          <li>Check your email inbox for a verification link. Click it to activate your account.</li>
        </ol>
      </section>

      {/* 2. Buying */}
      <section id="buying" style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          2. How to Buy Equipment
        </h2>
        
        <h3 style={{ marginTop: 20, marginBottom: 12, color: '#1e293b' }}>Finding items</h3>
        <ul style={{ paddingLeft: 20, color: '#374151', lineHeight: 2 }}>
          <li>Use the <b>search bar</b> at the top of any page.</li>
          <li>Filter by <b>Category</b>, <b>Brand</b>, <b>Condition</b>, or <b>Price range</b> on the left side of the <Link href="/listings" style={{color: '#0d6efd'}}>Listings page</Link>.</li>
          <li>Click any listing card to view full details, photos, and specifications.</li>
        </ul>

        <h3 style={{ marginTop: 24, marginBottom: 12, color: '#1e293b' }}>Saving items to your watchlist</h3>
        <ul style={{ paddingLeft: 20, color: '#374151', lineHeight: 2 }}>
          <li>Click the <b>heart icon (♥)</b> on any listing card or detail page.</li>
          <li>Your saved items appear under the <b>Saved</b> link in the top navigation.</li>
        </ul>

        <h3 style={{ marginTop: 24, marginBottom: 12, color: '#1e293b' }}>Contacting a seller</h3>
        <ul style={{ paddingLeft: 20, color: '#374151', lineHeight: 2 }}>
          <li>Open any listing detail page.</li>
          <li>Fill in the <b>Send Inquiry to Seller</b> form on the right side.</li>
          <li>The seller will receive your message and reply to you by email.</li>
        </ul>
      </section>

      {/* 3. Selling */}
      <section id="selling" style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          3. How to Sell Equipment
        </h2>

        <h3 style={{ marginTop: 20, marginBottom: 12, color: '#1e293b' }}>Posting a new listing</h3>
        <ol style={{ paddingLeft: 20, color: '#374151', lineHeight: 2 }}>
          <li>Log in and click <b>+ New Listing</b> from your dashboard.</li>
          <li>Enter a clear <b>Title</b> (e.g., "Siemens 1.5T MRI Machine, Refurbished").</li>
          <li>Add a detailed <b>Description</b> with condition, year, and accessories included.</li>
          <li>Set your <b>Price</b> and choose the <b>Currency</b>.</li>
          <li>Choose the <b>Condition</b> (New, Used, or Refurbished).</li>
          <li>Select the correct <b>Category</b> and <b>Brand</b>.</li>
          <li>Upload up to 10 photos. The first photo becomes your cover image.</li>
          <li>Click <b>Submit for review</b>. Your listing will be live once our admin team approves it (usually within 1 hour).</li>
        </ol>

        <h3 style={{ marginTop: 24, marginBottom: 12, color: '#1e293b' }}>Replying to buyers</h3>
        <ul style={{ paddingLeft: 20, color: '#374151', lineHeight: 2 }}>
          <li>When a buyer sends you a message, you'll receive an email alert.</li>
          <li>Log in and click <b>Inbox</b> in the top navigation.</li>
          <li>You can reply directly from your own email, or click "Reply by Email" in the inbox.</li>
        </ul>
      </section>

      {/* 4. Featured */}
      <section id="featured" style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          4. How to Feature a Listing
        </h2>
        <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
          Featured listings appear at the top of the homepage and in search results with a gold star badge. This dramatically increases visibility and buyer inquiries.
        </p>
        <ol style={{ paddingLeft: 20, color: '#374151', lineHeight: 2 }}>
          <li>Go to your dashboard and click <b>Edit</b> on any active listing.</li>
          <li>Click the gold <b>"Feature for $49"</b> button at the top.</li>
          <li>You'll be redirected to Stripe's secure checkout page.</li>
          <li>Enter your card details and pay.</li>
          <li>Your listing is instantly upgraded for 30 days.</li>
        </ol>
      </section>

      {/* 5. FAQ */}
      <section id="faq" style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          5. Frequently Asked Questions
        </h2>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, marginBottom: 4 }}>How much does it cost?</h4>
          <p style={{ color: '#6b7280', lineHeight: 1.6 }}>Listing equipment is completely free. You only pay if you choose to "Feature" a listing ($49 for 30 days).</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Why is my listing not showing up?</h4>
          <p style={{ color: '#6b7280', lineHeight: 1.6 }}>New listings are reviewed by our admin team before going live to prevent spam. This usually takes less than 1 hour.</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, marginBottom: 4 }}>How do I edit or delete my listing?</h4>
          <p style={{ color: '#6b7280', lineHeight: 1.6 }}>Go to your Dashboard, find the listing, and click the <b>Edit</b> or <b>Delete</b> button on the right side.</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Is my payment secure?</h4>
          <p style={{ color: '#6b7280', lineHeight: 1.6 }}>Yes. All payments are processed securely by Stripe. We never store your credit card details on our servers.</p>
        </div>
      </section>

      {/* Footer Navigation */}
      <div style={{ marginTop: 60, paddingTop: 20, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}