export default function Page() {
  return (
    <div className="container" style={{ padding: "60px 20px", maxWidth: 720 }}>
      <h1>Coming soon</h1>
      <p style={{ color: "#6b7280", marginTop: 12 }}>
        This section is under construction. Please check back later.
      </p>
      <a
        href="/listings"
        className="btn"
        style={{ display: "inline-block", marginTop: 20 }}
      >
        Browse all listings
      </a>
    </div>
  );
}
