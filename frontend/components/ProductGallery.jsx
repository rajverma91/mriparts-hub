'use client';
import { useEffect, useState } from 'react';

export default function ProductGallery({ images = [], title }) {
  const list = images.length ? images : ['https://via.placeholder.com/900x600?text=No+Image'];
  const [active, setActive]     = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // keyboard nav
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e) {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') setActive((a) => (a + 1) % list.length);
      if (e.key === 'ArrowLeft')  setActive((a) => (a - 1 + list.length) % list.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, list.length]);

  return (
    <div>
      {/* Main image */}
      <div
        className="card"
        style={{ padding: 0, overflow: 'hidden', position: 'relative', cursor: 'zoom-in' }}
        onClick={() => setLightbox(true)}
      >
        <img
          src={list[active]}
          alt={title}
          style={{ width: '100%', height: 480, objectFit: 'contain', background: '#f8fafc', display: 'block' }}
        />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: '#0d6efd', color: '#fff', padding: '4px 12px',
          borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: .5
        }}>
          FOR SALE
        </span>

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActive((active - 1 + list.length) % list.length); }}
              style={navBtn('left')}
              aria-label="Previous"
            >‹</button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActive((active + 1) % list.length); }}
              style={navBtn('right')}
              aria-label="Next"
            >›</button>
            <span style={{
              position: 'absolute', bottom: 12, right: 12,
              background: 'rgba(17,24,39,.7)', color: '#fff',
              padding: '3px 10px', borderRadius: 999, fontSize: 12
            }}>
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {list.length > 1 && (
        <div style={{
          display: 'flex', gap: 8, marginTop: 10,
          overflowX: 'auto', paddingBottom: 4
        }}>
          {list.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              style={{
                border: i === active ? '2px solid #0d6efd' : '1px solid #e5e7eb',
                borderRadius: 8, padding: 0, background: '#fff', cursor: 'pointer',
                width: 84, height: 84, flexShrink: 0, overflow: 'hidden'
              }}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20, cursor: 'zoom-out'
          }}
        >
          <img
            src={list[active]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }}
          />

          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActive((active - 1 + list.length) % list.length); }}
                style={navBtn('left', 'lightbox')}
              >‹</button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActive((active + 1) % list.length); }}
                style={navBtn('right', 'lightbox')}
              >›</button>
            </>
          )}

          <button
            type="button"
            onClick={() => setLightbox(false)}
            style={{
              position: 'absolute', top: 20, right: 20,
              width: 40, height: 40, borderRadius: '50%',
              border: 'none', background: 'rgba(255,255,255,.15)',
              color: '#fff', fontSize: 22, cursor: 'pointer'
            }}
          >×</button>
        </div>
      )}
    </div>
  );
}

function navBtn(side, variant) {
  const base = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 42, height: 42, borderRadius: '50%',
    border: 'none', cursor: 'pointer',
    fontSize: 22, lineHeight: '42px', padding: 0
  };
  if (variant === 'lightbox') {
    return {
      ...base,
      [side]: 20,
      background: 'rgba(255,255,255,.2)',
      color: '#fff'
    };
  }
  return {
    ...base,
    [side]: 12,
    background: 'rgba(255,255,255,.85)',
    color: '#111827',
    boxShadow: '0 2px 6px rgba(0,0,0,.1)'
  };
}