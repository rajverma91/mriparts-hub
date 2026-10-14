'use client';

export default function ShareButtons({ url, title }) {
  const enc = encodeURIComponent;
  const links = [
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`],
    ['Twitter',  `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`],
    ['WhatsApp', `https://api.whatsapp.com/send?text=${enc(title + ' ' + url)}`],
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied');
    } catch {}
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>Share:</span>
      {links.map(([name, href]) => (
        <a key={name} href={href} target="_blank" rel="noreferrer"
           style={{ fontSize: 13, color: '#0d6efd' }}>
          {name}
        </a>
      ))}
      <button onClick={copyLink} className="btn btn-outline"
              style={{ padding: '2px 10px', fontSize: 13 }}>Copy</button>
    </div>
  );
}