export default function AgreementsPage() {
  const sections = [
    ['1. Acceptance of Terms', 'By using MRI Parts Hub you agree to these terms. If you disagree, do not use the platform.'],
    ['2. Account Responsibilities', 'You are responsible for maintaining the security of your account credentials. Notify us immediately of unauthorised access.'],
    ['3. Listing Rules', 'All listings must describe medical equipment accurately. Prohibited items include counterfeit devices, stolen equipment, and items without proper regulatory clearance.'],
    ['4. Fees & Payments', 'Standard listings are free. Featured listings cost $49 per 30 days. All payments are handled by Stripe.'],
    ['5. Dispute Resolution', 'We are a marketplace, not a party to transactions. Disputes between buyers and sellers must be resolved between them.'],
    ['6. Privacy', 'We collect your name, email, and country to operate the marketplace. We do not sell your data to third parties.'],
    ['7. Termination', 'We may suspend accounts that violate these terms, with notice where practicable.'],
    ['8. Limitation of Liability', 'MRI Parts Hub is provided "as is". We are not liable for indirect damages arising from use of the platform.'],
  ];

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 820 }}>
      <h1 style={{ marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>Last updated: {new Date().toLocaleDateString()}</p>

      {sections.map(([title, body]) => (
        <section key={title} style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 6 }}>{title}</h3>
          <p style={{ color: '#374151', lineHeight: 1.7 }}>{body}</p>
        </section>
      ))}

      <p style={{ color: '#6b7280', marginTop: 32, fontSize: 14 }}>
        Questions? Contact us at <a href="mailto:support@mripartshub.com" style={{ color: '#0d6efd' }}>support@mripartshub.com</a>.
      </p>
    </div>
  );
}