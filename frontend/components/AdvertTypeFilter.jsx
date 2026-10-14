'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const OPTIONS = [
  { value: 'all',     label: 'All' },
  { value: 'sell',    label: 'SELL' },
  { value: 'buy',     label: 'BUY' },
  { value: 'auction', label: 'AUCTION' },
];

export default function AdvertTypeFilter() {
  const sp = useSearchParams();
  const router = useRouter();
  const current = sp.get('advert_type') || 'all';

  const [open, setOpen]     = useState(true);
  const [counts, setCounts] = useState({ all: 0, sell: 0, buy: 0, auction: 0 });

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/listings/stats/advert-types`);
        if (r.ok) setCounts(await r.json());
      } catch {}
    })();
  }, [sp.toString()]);

  function pick(value) {
    const p = new URLSearchParams(sp.toString());
    if (value === 'all') p.delete('advert_type');
    else p.set('advert_type', value);
    p.delete('page');
    router.push(`/listings?${p.toString()}`);
  }

  return (
    <div className="card" style={{ padding: 16, marginBottom: 14 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          all: 'unset',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: 13,
          color: '#1e293b',
          letterSpacing: 0.6,
          marginBottom: open ? 12 : 0
        }}
      >
        ADVERTS TYPE
        <span style={{ color: '#0d6efd', fontSize: 14 }}>{open ? '⌃' : '⌄'}</span>
      </button>

      {open && (
        <div>
          {OPTIONS.map((opt) => {
            const selected   = current === opt.value;
            const count      = counts[opt.value] || 0;
            const disabled   = count === 0 && opt.value !== 'all';

            return (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 4px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.45 : 1,
                  fontSize: 14,
                  color: '#334155'
                }}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && pick(opt.value)}
                  style={{
                    all: 'unset',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: selected ? '6px solid #0d6efd' : '2px solid #cbd5e1',
                    background: '#fff',
                    boxSizing: 'border-box',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                    transition: 'border .15s'
                  }}
                  role="radio"
                  aria-checked={selected}
                />
                <span>
                  {opt.label}{' '}
                  <span style={{ color: '#64748b' }}>({count})</span>
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}