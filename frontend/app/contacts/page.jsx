export default function ContactsPage() {
  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: 820 }}>
      <h1 style={{ marginBottom: 24 }}>Contact us</h1>

      <div className="grid grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 12 }}>General inquiries</h3>
          <p style={{ color: '#374151', lineHeight: 1.8 }}>
            <b>Email:</b> <a href="mailto:support@mripartshub.com" style={{ color: '#0d6efd' }}>support@mripartshub.com</a><br />
            <b>Phone:</b> <a href="tel:+18583260226" style={{ color: '#0d6efd' }}>+1 (858) 326-0226</a>
          </p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Business hours</h3>
          <p style={{ color: '#374151', lineHeight: 1.8 }}>
            <b>Mon–Thu:</b> 8:30 AM – 4:00 PM PST<br />
            <b>Fri:</b> 8:30 AM – 3:00 PM PST<br />
            <b>Sat–Sun:</b> Closed
          </p>
        </div>

        <div className="card" style={{ padding: 24, gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: 12 }}>Mailing address</h3>
          <p style={{ color: '#374151', lineHeight: 1.8 }}>
            MRI Parts Hub<br />
            5909 Sea Lion Pl, Suite F<br />
            Carlsbad, CA 92010<br />
            United States
          </p>
        </div>

        <div className="card" style={{ padding: 24, gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: 12 }}>Send us a message</h3>
          <form style={{ display: 'grid', gap: 12 }}>
            <input placeholder="Your name" />
            <input type="email" placeholder="Your email" />
            <textarea rows={5} placeholder="Your message" />
            <button className="btn" type="button">Send message</button>
          </form>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>
            (Form is coming soon — please use the email above for now.)
          </p>
        </div>
      </div>
    </div>
  );
}