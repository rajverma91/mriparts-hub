const FAQ = [
  ['How do I list equipment for sale?', 'Register as a seller, verify your email, then go to Dashboard → + New Listing.'],
  ['Is it free?', 'Yes — listing equipment is free. Optional featured placement costs $49 per 30 days.'],
  ['How are payments handled?', 'Featured listings are paid via Stripe. Direct sales between buyers and sellers are arranged privately.'],
  ['How do I contact a seller?', 'Open any listing and use the inquiry form on the detail page. Sellers receive an email and can reply from their dashboard.'],
  ['How do I verify my account?', 'We send a verification email when you register. Click the link to confirm.'],
  ['What if a seller doesn\'t respond?', 'Report unresponsive sellers at support@mripartshub.com. We investigate every report.'],
  ['Can I edit my listing after posting?', 'Yes — go to Dashboard → My Listings → Edit.'],
  ['How does the blacklist work?', 'We publicly list sellers who have been reported for fraud or repeated violations.'],
];

export default function FAQPage() {
  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 820 }}>
      <h1 style={{ marginBottom: 8 }}>Frequently asked questions</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>Answers to common questions about using MRI Parts Hub.</p>

      {FAQ.map(([q, a], i) => (
        <details
          key={i}
          className="card"
          style={{ padding: 18, marginBottom: 10, cursor: 'pointer' }}
        >
          <summary style={{ fontWeight: 700, fontSize: 16 }}>{q}</summary>
          <p style={{ color: '#374151', marginTop: 10, lineHeight: 1.7 }}>{a}</p>
        </details>
      ))}

      <p style={{ marginTop: 32, color: '#6b7280' }}>
        Still have questions? <a href="/contacts" style={{ color: '#0d6efd' }}>Contact us →</a>
      </p>
    </div>
  );
}