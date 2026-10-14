'use client';
import { useRef, useState } from 'react';
import { getToken } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MultiImageUpload({ images = [], onChange, max = 10 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  async function uploadFiles(fileList) {
    const files = Array.from(fileList).slice(0, max - images.length);
    if (!files.length) return;

    const tooBig = files.find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than 5 MB`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));

      const res = await fetch(`${API}/upload/multiple`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onChange([...images, ...data.urls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  }

  function removeAt(i) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  function moveTo(i, dir) {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          display: 'block',
          padding: 24,
          border: `2px dashed ${dragOver ? '#0d6efd' : '#cbd5e1'}`,
          borderRadius: 12,
          textAlign: 'center',
          cursor: images.length >= max ? 'not-allowed' : 'pointer',
          background: dragOver ? '#eff6ff' : '#fff',
          transition: 'all .15s'
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif"
          style={{ display: 'none' }}
          disabled={images.length >= max}
          onChange={(e) => uploadFiles(e.target.files)}
        />

        {uploading ? (
          <div>Uploading…</div>
        ) : (
          <>
            <div style={{ fontSize: 32 }}>📸</div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>
              {images.length >= max ? 'Maximum images reached' : 'Drag & drop photos here'}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
              or <span style={{ color: '#0d6efd', textDecoration: 'underline' }}>click to browse</span>
              {' '}· JPG/PNG/WEBP · max 5 MB each · up to {max}
            </div>
          </>
        )}
      </label>

      {error && <div className="alert error" style={{ marginTop: 8 }}>{error}</div>}

      {images.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: '#6b7280', margin: '12px 0 6px' }}>
            {images.length} image{images.length === 1 ? '' : 's'} — first image is the cover.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
            {images.map((src, i) => (
              <div
                key={src + i}
                style={{
                  position: 'relative',
                  border: i === 0 ? '2px solid #0d6efd' : '1px solid #e5e7eb',
                  borderRadius: 10, overflow: 'hidden', background: '#fff'
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />

                {i === 0 && (
                  <span style={{
                    position: 'absolute', top: 4, left: 4,
                    background: '#0d6efd', color: '#fff',
                    fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700
                  }}>
                    COVER
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  title="Remove"
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 22, height: 22, borderRadius: '50%',
                    border: 'none', background: 'rgba(220,53,69,.9)', color: '#fff',
                    fontSize: 12, lineHeight: '22px', textAlign: 'center', cursor: 'pointer'
                  }}
                >
                  ×
                </button>

                <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    type="button"
                    onClick={() => moveTo(i, -1)}
                    disabled={i === 0}
                    style={{
                      flex: 1, border: 'none', background: '#f8fafc', padding: 4,
                      cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.4 : 1
                    }}
                  >←</button>
                  <button
                    type="button"
                    onClick={() => moveTo(i, 1)}
                    disabled={i === images.length - 1}
                    style={{
                      flex: 1, border: 'none', background: '#f8fafc', padding: 4,
                      borderLeft: '1px solid #f1f5f9',
                      cursor: i === images.length - 1 ? 'default' : 'pointer',
                      opacity: i === images.length - 1 ? 0.4 : 1
                    }}
                  >→</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}