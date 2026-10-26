import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — MRI Parts Hub',
  description: 'Learn how MRI Parts Hub collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 800 }}>
      
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#6b7280', marginBottom: 40 }}>
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div style={{ lineHeight: 1.8, color: '#374151', fontSize: 16 }}>
        
        <p style={{ marginBottom: 20 }}>
          At MRI Parts Hub ("we," "our," or "us"), we are committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
          when you visit our website, <strong>mripartshub.com</strong>.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, color: '#111827' }}>1. Information We Collect</h2>
        <p style={{ marginBottom: 12 }}>We may collect information about you in a variety of ways, including:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
          <li style={{ marginBottom: 8 }}><strong>Personal Data:</strong> Name, email address, phone number, company name, and billing address provided during registration or when sending an inquiry.</li>
          <li style={{ marginBottom: 8 }}><strong>Listing Data:</strong> Images, descriptions, and pricing of equipment you post on the platform.</li>
          <li style={{ marginBottom: 8 }}><strong>Payment Data:</strong> We use Stripe to process payments. We do not store or collect your payment card details. That information is provided directly to Stripe.</li>
          <li style={{ marginBottom: 8 }}><strong>Derivative Data:</strong> IP address, browser type, operating system, and access times, collected automatically when you use the site.</li>
        </ul>

        <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, color: '#111827' }}>2. How We Use Your Information</h2>
        <p style={{ marginBottom: 12 }}>We use the information we collect to:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
          <li style={{ marginBottom: 8 }}>Create and manage your account.</li>
          <li style={{ marginBottom: 8 }}>Facilitate communication between buyers and sellers (e.g., forwarding inquiry emails).</li>
          <li style={{ marginBottom: 8 }}>Process payments for featured listings and Pro subscriptions.</li>
          <li style={{ marginBottom: 8 }}>Send you administrative information, such as account verification and password reset emails.</li>
          <li style={{ marginBottom: 8 }}>Improve our website and user experience.</li>
        </ul>

        <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, color: '#111827' }}>3. Disclosure of Your Information</h2>
        <p style={{ marginBottom: 12 }}>We may share information we have collected about you in certain situations:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
          <li style={{ marginBottom: 8 }}><strong>To Other Users:</strong> When you post a listing, your seller name, company, and location will be visible to the public. When you send an inquiry, your name, email, and phone number are shared with the seller.</li>
          <li style={{ marginBottom: 8 }}><strong>Third-Party Service Providers:</strong> We share data with Stripe (payments), Cloudinary (image hosting), and our email delivery providers to operate the platform.</li>
          <li style={{ marginBottom: 8 }}><strong>By Law:</strong> If required by law, we may disclose your information to comply with legal processes.</li>
        </ul>

        <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, color: '#111827' }}>4. Cookies and Tracking Technologies</h2>
        <p style={{ marginBottom: 20 }}>
          We use cookies and similar tracking technologies to track activity on our platform and hold certain information. 
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
          However, if you do not accept cookies, you may not be able to use some portions of our service.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, color: '#111827' }}>5. Your Rights (GDPR & CCPA)</h2>
        <p style={{ marginBottom: 12 }}>
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
          <li style={{ marginBottom: 8 }}>The right to access, update, or delete the information we have on you.</li>
          <li style={{ marginBottom: 8 }}>The right of rectification (to correct inaccurate data).</li>
          <li style={{ marginBottom: 8 }}>The right to object to our processing of your personal data.</li>
          <li style={{ marginBottom: 8 }}>The right to data portability.</li>
        </ul>
        <p style={{ marginBottom: 20 }}>
          To exercise any of these rights, please contact us at <a href="mailto:support@mripartshub.com" style={{ color: '#0d6efd' }}>support@mripartshub.com</a>.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, color: '#111827' }}>6. Data Security</h2>
        <p style={{ marginBottom: 20 }}>
          We use administrative, technical, and physical security measures to help protect your personal information. 
          While we have taken reasonable steps to secure the personal information you provide to us, please be aware that 
          despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, color: '#111827' }}>7. Contact Us</h2>
        <p style={{ marginBottom: 20 }}>
          If you have questions or comments about this Privacy Policy, please contact us at:<br /><br />
          <strong>MRI Parts Hub</strong><br />
          5909 Sea Lion Pl, Suite F<br />
          Carlsbad, CA 92010<br />
          Email: <a href="mailto:support@mripartshub.com" style={{ color: '#0d6efd' }}>support@mripartshub.com</a>
        </p>

      </div>

      <div style={{ marginTop: 60, paddingTop: 20, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}