'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import MultiImageUpload from '@/components/MultiImageUpload';
import toast from 'react-hot-toast';

export default function NewListing() {
  const [cats, setCats]       = useState([]);
  const [brands, setBrands]   = useState([]);
  const [error, setError]     = useState('');
  const [needsVerify, setNeedsVerify] = useState(false);
  
  const [form, setForm] = useState({
    title: '', description: '', price: 0, currency: 'USD', condition_type: 'used',
    category_name: '', // Changed from category_id to category_name
    brand_name: '', 
    model: '', 
    address: '', city: '', state: '', pincode: '', country: '',
    gallery_json: [],
    advert_type: 'sell' 
  });
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const [c, b] = await Promise.all([api.get('/categories'), api.get('/brands')]);
        setCats(c);
        setBrands(b);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const update = (k, v) => setForm({ ...form, [k]: v });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setNeedsVerify(false);

    const toastId = toast.loading('Submitting your listing...');

    try {
      await api.post('/listings', {
        ...form,
        image_url: form.gallery_json[0] || null,
        // We no longer send category_id, we send category_name
      });
      
      toast.success('Listing submitted for review!', { id: toastId });
      router.push('/dashboard');
      
    } catch (err) {
      if (err.message === 'LIMIT_REACHED') {
        toast.error('You have reached the 1 free listing limit.', { id: toastId });
        setTimeout(() => { router.push('/pro-account'); }, 1500);
        return;
      }

      toast.error(err.message, { id: toastId });
      setError(err.message);
      
      if (err.message.toLowerCase().includes('verify')) {
        setNeedsVerify(true);
      }
    }
  }

  return (
    <form onSubmit={submit} className="container" style={{ padding: '30px 20px', maxWidth: 800 }}>
      <h1>New Listing</h1>

      {error && !needsVerify && <div className="alert error">{error}</div>}

      {needsVerify && (
        <div className="alert" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '14px 18px', borderRadius: 8, marginBottom: 16 }}>
          <b>⚠️ Please verify your email before creating listings.</b>
          <div style={{ marginTop: 8, fontSize: 14 }}>
            Check your inbox for the verification link, or <Link href="/dashboard" style={{ textDecoration: 'underline' }}>go to your dashboard</Link> to resend it.
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 24, marginTop: 16 }}>
        
        {/* Advert Type */}
        <div className="form-row" style={{ marginBottom: 20 }}>
          <label>Advert type</label>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '6px 0' }}>
            {[['sell', 'Sell'], ['buy', 'Buy'], ['auction', 'Auction']].map(([val, label]) => (
              <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                <input type="radio" name="advert_type" value={val} checked={form.advert_type === val} onChange={() => update('advert_type', val)} style={{ accentColor: '#0d6efd', width: 18, height: 18, margin: 0 }} />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Title *</label>
          <input required value={form.title} onChange={(e) => update('title', e.target.value)} />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea rows={5} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-row">
            <label>Price</label>
            <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} />
          </div>

          <div className="form-row">
            <label>Currency</label>
            <select value={form.currency} onChange={(e) => update('currency', e.target.value)}>
              <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
            </select>
          </div>

          <div className="form-row">
            <label>Condition</label>
            <select value={form.condition_type} onChange={(e) => update('condition_type', e.target.value)}>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          {/* Updated Category Field (Text Input with Datalist) */}
          <div className="form-row">
            <label>Category</label>
            <input 
              list="category-options" 
              value={form.category_name} 
              onChange={(e) => update('category_name', e.target.value)} 
              placeholder="Select or type a new category"
            />
            <datalist id="category-options">
              {cats.map((c) => <option key={c.id} value={c.name} />)}
            </datalist>
          </div>

          {/* Updated Brand Field (Text Input with Datalist) */}
          <div className="form-row">
            <label>Brand / Manufacturer</label>
            <input 
              list="brand-options" 
              value={form.brand_name} 
              onChange={(e) => update('brand_name', e.target.value)} 
              placeholder="Select or type a new brand"
            />
            <datalist id="brand-options">
              {brands.map((b) => <option key={b.id} value={b.name} />)}
            </datalist>
          </div>

          <div className="form-row">
            <label>Model</label>
            <input value={form.model} onChange={(e) => update('model', e.target.value)} />
          </div>
        </div>

        {/* New Address Fields */}
        <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: 18 }}>Location Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-row" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Street address" />
          </div>
          
          <div className="form-row">
            <label>City</label>
            <input value={form.city} onChange={(e) => update('city', e.target.value)} />
          </div>

          <div className="form-row">
            <label>State / Province</label>
            <input value={form.state} onChange={(e) => update('state', e.target.value)} />
          </div>

          <div className="form-row">
            <label>PIN / ZIP Code</label>
            <input value={form.pincode} onChange={(e) => update('pincode', e.target.value)} />
          </div>

          <div className="form-row">
            <label>Country</label>
            <input value={form.country} onChange={(e) => update('country', e.target.value)} />
          </div>
        </div>

        <div className="form-row" style={{ marginTop: 24 }}>
          <label>Photos</label>
          <MultiImageUpload images={form.gallery_json} onChange={(urls) => update('gallery_json', urls)} max={10} />
        </div>

        <button className="btn" style={{ marginTop: 18 }}>Submit for review</button>
      </div>
    </form>
  );
}