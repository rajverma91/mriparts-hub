'use client';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { api, getToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function PayPalCheckout({ amount, onSuccess, listingId }) { // Added listingId
  const paypalRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !window.paypal) return;
    if (paypalRef.current) paypalRef.current.innerHTML = '';

    window.paypal.Buttons({
      createOrder: async () => {
        if (!getToken()) {
          toast.error('Please log in to continue.');
          router.push('/login');
          throw new Error('Not authenticated');
        }
        try {
          // If featuring a listing, use the feature endpoint
          const endpoint = listingId ? '/paypal/create-feature-order' : '/paypal/create-order';
          const payload = listingId ? { listingId } : { amount, description: 'Pro Subscription' };
          
          const res = await api.post(endpoint, payload);
          return res.orderID;
        } catch (err) {
          toast.error(err.message || 'Could not create PayPal order');
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          const payload = listingId ? { listingId } : {};
          const res = await api.post(`/paypal/capture-order/${data.orderID}`, payload);
          
          if (res.status === 'COMPLETED') {
            toast.success('PayPal payment successful!');
            if (onSuccess) onSuccess(res.details);
          } else {
            toast.error('Payment not completed');
          }
        } catch (err) {
          toast.error('Failed to capture payment');
        }
      },
      onError: (err) => {
        console.error('PayPal Checkout Error:', err);
      }
    }).render(paypalRef.current);
  }, [loaded, amount, onSuccess, listingId, router]);

  return (
    <div>
      {!loaded && <p style={{ textAlign: 'center', fontSize: 12 }}>Loading PayPal...</p>}
      <div ref={paypalRef}></div>
    </div>
  );
}