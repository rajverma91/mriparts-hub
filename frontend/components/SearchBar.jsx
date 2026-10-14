'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SearchBar({ initial = '' }) {
  const [q, setQ]                 = useState(initial);
  const [open, setOpen]           = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [popular, setPopular]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [active, setActive]       = useState(-1);
  const router = useRouter();
  const wrapRef = useRef(null);

  // Load popular chips once
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/search/popular`);
        if (r.ok) setPopular(await r.json());
      } catch {}
    })();
  }, []);

  // Debounced autocomplete
  useEffect(() => {
    if (!q.trim()) { setSuggestions([]); return; }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const r = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
        const data = await r.json();
        setSuggestions(data.suggestions || []);
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
    }, 180);
    return () => clearTimeout(id);
  }, [q]);

  // Close on outside click
  useEffect(() => {
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function submit(e) {
    e.preventDefault();
    if (active >= 0 && suggestions[active]) {
      router.push(suggestions[active].href);
      setOpen(false);
      return;
    }
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    router.push(`/listings?${p.toString()}`);
    setOpen(false);
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="hero-search-wrap">
      <form className="hero-search" onSubmit={submit}>
      <span className="hero-search-icon" aria-hidden="true">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="v-icon__svg"
    focusable="false"
  >
    <path d="M15.0515 14.3208H15.8645L21 19.4666L19.4666 21L14.3208 15.8645V15.0515L14.0429 14.7633C12.8696 15.7719 11.3465 16.3791 9.68954 16.3791C5.99485 16.3791 3 13.3842 3 9.68954C3 5.99485 5.99485 3 9.68954 3C13.3842 3 16.3791 5.99485 16.3791 9.68954C16.3791 11.3465 15.7719 12.8696 14.7633 14.0429L15.0515 14.3208ZM5.05832 9.68954C5.05832 12.2521 7.12693 14.3208 9.68954 14.3208C12.2521 14.3208 14.3208 12.2521 14.3208 9.68954C14.3208 7.12693 12.2521 5.05832 9.68954 5.05832C7.12693 5.05832 5.05832 7.12693 5.05832 9.68954Z" />
  </svg>
</span>
        <input
          placeholder="I'm looking for..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
        <button className="hero-search-btn" type="submit">Search</button>
      </form>

      {open && (
        <div className="search-dropdown">
          {/* No query → popular chips */}
          {!q.trim() && popular.length > 0 && (
            <>
              <div className="search-dropdown-title">Popular on MRI Parts Hub</div>
              <div className="search-chips">
                {popular.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    className="search-chip"
                    onClick={() => {
                      router.push(`/listings?category=${c.slug}`);
                      setOpen(false);
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* With query → suggestions */}
          {q.trim() && (
            <>
              {loading && <div className="search-loading">Searching…</div>}

              {!loading && suggestions.length === 0 && (
                <div className="search-empty">No matches for "{q}"</div>
              )}

              {!loading && suggestions.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className={`search-suggestion ${i === active ? 'active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={(e) => { e.preventDefault(); router.push(s.href); setOpen(false); }}
                >
                  <span className="search-sug-left">
                    <span className="search-sug-prefix">{q}</span>
                    {s.type === 'category' && <span> in {s.raw}</span>}
                    {s.type === 'brand' && <span> by {s.raw}</span>}
                    {s.type === 'listing' && (
                      <>
                        <span> · </span>
                        <span style={{ color: '#374151', fontWeight: 500 }}>{s.label}</span>
                      </>
                    )}
                  </span>

                  <span className="search-sug-right">
                    {s.type === 'listing' && s.price && <span className="search-sug-price">{s.price}</span>}
                    <span className="search-sug-arrow">↗</span>
                  </span>
                </a>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}