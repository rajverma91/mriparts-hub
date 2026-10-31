'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import MultiImageUpload from '@/components/MultiImageUpload';
import FeaturePromo from '@/components/FeaturePromo';
import { parseGallery } from '@/lib/parseGallery';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();
  const [cats, setCats]     = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm]     = useState(null);
  const [error, setError]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [c, b] = await Promise.all([api.get('/categories'), api.get('/brands')]);
        setCats(c);
        setBrands(b);

        const mine = await api.get('/listings/user/mine');
        const item = mine.find((x) => String(x.id) === String(id));
        if (!item) return setError('Not found');

        let gallery = parseGallery(item.gallery_json);
        if (!gallery.length && item.image_url) gallery = [item.image_url];

        setForm({
          title: item.title || '',
          description: item.description || '',
          price: item.price || 0,
          currency: item.currency || 'USD',
          condition_type: item.condition_type || 'used',
          category_name: item.category || '', 
          brand_name: item.brand || '',       
          model: item.model || '',
          address: item.address || '',
          city: item.city || '',
          state: item.state || '',
          pincode: item.pincode || '',
          country: item.country || '',
          gallery_json: gallery
        });
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  const update = (k, v) => setForm({ ...form, [k]: v });

  async function submit(e) {
    e.preventDefault();
    setError('');
    const toastId = toast.loading('Saving changes...');
    try {
      await api.put(`/listings/${id}`, {
        ...form,
        image_url: form.gallery_json[0] || null,
      });
      toast.success('Listing updated successfully!', { id: toastId });
      router.push('/dashboard');
    } catch (e) { 
      toast.error(e.message, { id: toastId });
      setError(e.message); 
    }
  }

  if (error) return <div className="container" style={{ padding: 40 }}>{error}</div>;
  if (!form) return <div className="container" style={{ padding: 40 }}>Loading...</div>;

  return (
    <form onSubmit={submit} className="container" style={{ padding: '30px 20px', maxWidth: 800 }}>
      <h1>Edit Listing</h1>

      <FeaturePromo listingId={id} />

      <div className="card" style={{ padding: 24, marginTop: 16 }}>
        <div className="form-row">
          <label>Title</label>
          <input required value={form.title} onChange={(e) => update('title', e.target.value)} />
        </div>

        {/* RICH TEXT EDITOR FOR DESCRIPTION */}
        <div className="form-row">
          <label>Description</label>
          <div style={{ background: '#fff', minHeight: 200, marginBottom: 50 }}>
            <ReactQuill 
              theme="snow" 
              value={form.description} 
              onChange={(content) => update('description', content)}
              style={{ height: 150 }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-row">
            <label>Price</label>
            <input type="number" value={form.price}
                   onChange={(e) => update('price', e.target.value)} />
          </div>

          <div className="form-row">
            <label>Currency</label>
            <input value={form.currency} onChange={(e) => update('currency', e.target.value)} />
          </div>

          <div className="form-row">
            <label>Condition</label>
            <select value={form.condition_type}
                    onChange={(e) => update('condition_type', e.target.value)}>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

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

        {/* Address Fields */}
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
          <MultiImageUpload
            images={form.gallery_json}
            onChange={(urls) => update('gallery_json', urls)}
            max={10}
          />
        </div>

        <button className="btn" style={{ marginTop: 18 }}>Save changes</button>
      </div>
    </form>
  );
}