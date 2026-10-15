export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 820 }}>
      <h1 style={{ marginBottom: 20 }}>About MRI Parts Hub</h1>

      <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 20 }}>
        MRI Parts Hub is a global marketplace for new and used medical imaging equipment
        and spare parts. We connect hospitals, clinics, refurbishers, and independent
        service engineers with verified sellers around the world.
      </p>

      <h2 style={{ marginTop: 32, marginBottom: 12 }}>Our mission</h2>
      <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: 20 }}>
        Medical imaging equipment is expensive. A single MRI machine can cost more than
        a house. Our mission is to make the market transparent — so buyers can find the
        right equipment at a fair price, and sellers can reach a global audience without
        paying commissions.
      </p>

      <h2 style={{ marginTop: 32, marginBottom: 12 }}>Why sellers choose us</h2>
      <ul style={{ color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>Free to list — no commission on sales</li>
        <li>Reach verified buyers in 40+ countries</li>
        <li>Email + phone verification for every seller</li>
        <li>Featured placement for maximum visibility</li>
      </ul>

      <h2 style={{ marginTop: 32, marginBottom: 12 }}>Why buyers trust us</h2>
      <ul style={{ color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>Every seller is verified before listing</li>
        <li>Buyer reviews on every transaction</li>
        <li>Public blacklist of fraudulent sellers</li>
        <li>Direct contact with sellers — no middleman</li>
      </ul>
    </div>
  );
}