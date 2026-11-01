import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions — MRI Parts Hub',
  description: 'Read the terms and conditions governing the use of the MRI Parts Hub marketplace.',
};

export default function TermsOfService() {
  const sections = [
    { id: 'about', title: '1. About MRI Parts Hub', content: 'MRI Parts Hub operates as a product inquiry, lead-generation, and supplier-matching platform focused on MRI and CT parts, medical imaging equipment, related products, and technical services. Buyers may submit product inquiries or requests through the Website. The MRI Parts Hub team may review these requests and forward them to relevant sellers, suppliers, manufacturers, or service providers. MRI Parts Hub does not act as the seller or supplier of products listed or requested through the Website unless expressly stated otherwise.' },
    { id: 'eligibility', title: '2. Eligibility and Acceptance', content: 'By using this Website, you represent that you are legally capable of entering into a binding agreement, you will use the Website only for lawful purposes, any information you provide is accurate and not misleading, and you will comply with applicable laws and regulations when using the Website.' },
    { id: 'account', title: '3. Account Registration', content: 'Certain Website features may require an account or the submission of contact information. You agree to provide accurate and current registration information, maintain the confidentiality of your login credentials, and notify us promptly if you suspect unauthorized access to your account. We reserve the right to suspend or restrict accounts that contain false information or violate these Terms.' },
    { id: 'listings', title: '4. Product Listings and Information', content: 'MRI Parts Hub may display information about new, used, refurbished, replacement, aftermarket, or original equipment manufacturer (OEM) parts. Product descriptions, images, specifications, availability, pricing, and compatibility information may be provided by third parties. We aim to present information accurately but do not guarantee that all information is complete, current, or error-free. Users should independently verify compatibility, condition, authenticity, and safety requirements before purchasing.' },
    { id: 'seller-responsibilities', title: '5. Seller Responsibilities', content: 'Users and suppliers who submit product or service listings must ensure that their listings are lawful, accurate, and not misleading. Prohibited activities include listing counterfeit or stolen products, misrepresenting a product\'s manufacturer or condition, offering products that cannot lawfully be sold, making unsupported claims regarding MRI safety or regulatory clearance, and infringing intellectual property rights.' },
    { id: 'safety', title: '6. Medical Equipment and MRI Safety Disclaimer', content: 'MRI and CT equipment, components, and accessories may involve specialized technical, electrical, mechanical, magnetic-field, and patient-safety considerations. Information on this Website is provided for general informational purposes and is not a substitute for professional engineering advice or manufacturer instructions. No product should be assumed to be MRI Safe or MR Conditional merely because it appears on this Website. Users must independently verify applicable MRI safety labeling and compatibility before use.' },
    { id: 'inquiries', title: '7. Product Inquiries and Transactions', content: 'MRI Parts Hub provides a platform through which buyers can submit requests for medical equipment and services. The inquiry process works as follows: Buyers submit a request, MRI Parts Hub reviews the request and forwards it to relevant sellers, and the seller contacts the buyer directly. MRI Parts Hub does not guarantee the accuracy of third-party quotations or the suitability of any product. Unless expressly agreed otherwise, MRI Parts Hub is not a party to any sales contract or transaction entered into between a buyer and a seller.' },
    { id: 'fees', title: '8. Fees, Featured Listings, and Payments', content: 'Standard listings may be offered free of charge. Featured listings may be offered for $49 per 30-day period. Any applicable listing fees will be disclosed before payment. Where Stripe is used to process payments, transactions are also subject to the payment processor\'s terms. Paid placement does not guarantee sales, inquiries, or a particular search position.' },
    { id: 'affiliate', title: '9. Affiliate Links and Third-Party Products', content: 'MRI Parts Hub may participate in affiliate marketing programs and include links to third-party retailers or service providers. We may earn a commission when a user clicks an affiliate link or makes a qualifying purchase, at no additional cost to the user. Affiliate relationships do not guarantee that a product is suitable for a particular purpose or that a third-party seller is authorized by a manufacturer.' },
    { id: 'third-party', title: '10. Third-Party Websites and Services', content: 'The Website may contain links to external websites operated independently of MRI Parts Hub. We do not control and are not responsible for their content, privacy practices, products, or security. A link or reference does not necessarily imply an endorsement or partnership by MRI Parts Hub.' },
    { id: 'pricing', title: '11. Pricing, Availability, Shipping, and Returns', content: 'Prices and availability displayed on the Website may change without notice. Unless MRI Parts Hub expressly acts as the seller, the relevant seller or retailer is responsible for confirming orders, fulfilling purchases, arranging shipping, handling returns, and providing applicable warranties. Buyers should obtain written confirmation of delivery terms and return eligibility before placing an order.' },
    { id: 'disputes', title: '12. Disputes Between Buyers and Sellers', content: 'Where MRI Parts Hub operates as a listing or marketplace platform, it is not a party to transactions concluded directly between buyers and sellers. Buyers and sellers are responsible for resolving disputes concerning product condition, compatibility, payment, delivery, installation, returns, refunds, warranties, and contractual obligations. We may, at our discretion, assist with communications, but we do not guarantee that we can resolve a dispute or recover funds for either party.' },
    { id: 'privacy', title: '13. Privacy and Personal Information', content: 'MRI Parts Hub may collect personal information such as names, email addresses, account details, and location information as needed to operate and improve the Website. Information may be used to operate accounts, respond to inquiries, connect buyers and suppliers, process payments, and prevent fraud. We do not sell personal information to third parties. Our handling of personal information is further described in our Privacy Policy.' },
    { id: 'ip', title: '14. Intellectual Property', content: 'Unless otherwise indicated, the Website\'s original content, branding, logos, text, and design elements are owned by or licensed to MRI Parts Hub and are protected by applicable intellectual property laws. You may not copy, reproduce, distribute, or commercially exploit Website content without prior permission. Third-party trademarks and product names remain the property of their respective owners.' },
    { id: 'prohibited', title: '15. Prohibited Website Use', content: 'You agree not to use the Website for fraudulent or unlawful purposes, submit false or unauthorized listings, attempt to gain unauthorized access to Website systems, distribute malware, scrape or harvest Website data, or interfere with Website operations. We may investigate suspected violations and take appropriate action, including removing content or restricting access.' },
    { id: 'termination', title: '16. Suspension and Termination', content: 'We may suspend, restrict, or terminate access to the Website if we reasonably believe a user has violated these Terms, engaged in fraudulent conduct, or created a security risk. Where reasonably practicable, we will provide notice of the action and an opportunity to address the issue. Users may stop using the Website at any time.' },
    { id: 'warranties', title: '17. Disclaimer of Warranties', content: 'To the extent permitted by applicable law, the Website and its content are provided on an "AS IS" and "AS AVAILABLE" basis. MRI Parts Hub does not guarantee uninterrupted access, error-free operation, the accuracy of all third-party information, or the availability and performance of products and services listed by others.' },
    { id: 'liability', title: '18. Limitation of Liability', content: 'To the maximum extent permitted by applicable law, MRI Parts Hub and its owners, operators, and service providers will not be liable for indirect, incidental, special, exemplary, or consequential damages arising from the use of, or inability to use, the Website. This includes lost profits, lost business opportunities, or losses arising from third-party transactions.' },
    { id: 'indemnification', title: '19. Indemnification', content: 'To the extent permitted by applicable law, users agree to indemnify and hold harmless MRI Parts Hub and its owners, operators, and service providers from third-party claims, losses, liabilities, and reasonable expenses arising from the user\'s unlawful conduct or violation of these Terms.' },
    { id: 'changes', title: '20. Changes to These Terms', content: 'We may update these Terms and Conditions to reflect changes to the Website or applicable legal requirements. The revised version will be published on this page with an updated "Last Updated" date. Your continued use of the Website after updated Terms become effective constitutes acceptance where such acceptance is legally recognized.' },
    { id: 'law', title: '21. Governing Law and Jurisdiction', content: 'These Terms and Conditions are subject to the laws of the jurisdiction in which the legal operator of MRI Parts Hub is established, unless applicable law requires otherwise. Any dispute concerning these Terms will be handled by the courts with appropriate jurisdiction, subject to mandatory consumer protections.' },
    { id: 'severability', title: '22. Severability', content: 'If any provision of these Terms is held invalid, unlawful, or unenforceable, the remaining provisions will continue in effect to the extent permitted by law.' },
    { id: 'entire', title: '23. Entire Agreement', content: 'These Terms and Conditions, together with the Privacy Policy and any applicable policies referenced on the Website, constitute the agreement governing your use of MRI Parts Hub.' },
    { id: 'contact', title: '24. Contact Information', content: 'If you have questions about these Terms and Conditions, please contact us at support@mripartshub.com or write to us at 5909 Sea Lion Pl, Suite F, Carlsbad, CA 92010.' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 1100 }}>
      
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, marginBottom: 8, color: '#1e293b' }}>Terms and Conditions</h1>
        <p style={{ color: '#6b7280' }}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, alignItems: 'start' }}>
        
        {/* Sticky Sidebar */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 20, maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, borderBottom: '2px solid #eee', paddingBottom: 8 }}>Table of Contents</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sections.map((sec) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className="doc-link">
                  {sec.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="card" style={{ padding: 40 }}>
          <div style={{ lineHeight: 1.8, color: '#374151', fontSize: 15 }}>
            
            <p style={{ marginBottom: 32, fontSize: 16 }}>
              Welcome to MRI Parts Hub, available at <strong>https://mripartshub.com</strong>. These Terms and Conditions govern your access to and use of the MRI Parts Hub website. By accessing or using this Website, you agree to these Terms and Conditions.
            </p>

            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} style={{ marginBottom: 32, scrollMarginTop: 20 }}>
                <h3 style={{ fontSize: 20, color: '#111827', marginBottom: 12 }}>{sec.title}</h3>
                <p>{sec.content}</p>
              </section>
            ))}

            <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #eee', color: '#6b7280', fontSize: 14 }}>
              <p>
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:support@mripartshub.com" style={{ color: '#0d6efd' }}>support@mripartshub.com</a>.
              </p>
            </div>

          </div>
        </div>

      </div>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}