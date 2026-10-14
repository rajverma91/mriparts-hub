export default function TrustBar() {
  const items = [
    ['🔒', 'Secure Payment'],
    ['📦', 'Buyer Protection'],
    ['↩️', 'Returns Policy'],
    ['✅', 'Verified Seller'],
  ];
  return (
    <div className="card" style={{ padding: 14, marginTop: 12, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
      {items.map(([icon, label]) => (
        <div key={label} style={{ fontSize: 13, color: '#374151', display: 'flex', gap: 6 }}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
    </div>
  );
}