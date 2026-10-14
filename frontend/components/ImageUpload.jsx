'use client';
import { useState } from 'react';
import { getToken } from '@/lib/api';

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('image', file);

      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label
        style={{
          display: 'block', padding: 20, border: '2px dashed #cbd5e1',
          borderRadius: 10, textAlign: 'center', cursor: 'pointer',
          background: uploading ? '#f3f4f6' : '#fff'
        }}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <span>Uploading…</span>
        ) : value ? (
          <>
            <img
              src={value}
              alt="preview"
              style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8, marginBottom: 8 }}
            />
            <div style={{ fontSize: 13, color: '#0d6efd' }}>Click to replace image</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 32 }}>📸</div>
            <div style={{ marginTop: 6, fontWeight: 600 }}>Click to upload an image</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
              JPG / PNG / WEBP / GIF · max 5 MB
            </div>
          </>
        )}
      </label>

      {error && <div className="alert error" style={{ marginTop: 8 }}>{error}</div>}

      {value && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onChange('')}
          style={{ marginTop: 8, padding: '6px 12px' }}
        >
          Remove image
        </button>
      )}
    </div>
  );
}