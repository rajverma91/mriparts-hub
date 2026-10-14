// Robustly parse a listing's gallery_json field, regardless of whether it
// arrives as:
//   - a real array (mysql2 sometimes auto-parses JSON columns)
//   - a JSON string:        '["url1","url2"]'
//   - a double-encoded str: '"[\"url1\",\"url2\"]"'  (legacy bad data)
export function parseGallery(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === 'string') {
    // Try one pass
    try {
      const once = JSON.parse(value);
      if (Array.isArray(once)) return once.filter(Boolean);

      // Try a second pass (double-encoded)
      if (typeof once === 'string') {
        try {
          const twice = JSON.parse(once);
          if (Array.isArray(twice)) return twice.filter(Boolean);
        } catch {}
      }
    } catch {}
  }

  return [];
}

// Convenience: get the first available image URL, falling back to image_url.
export function firstImage(item) {
  const gallery = parseGallery(item?.gallery_json);
  return gallery[0] || item?.image_url || null;
}