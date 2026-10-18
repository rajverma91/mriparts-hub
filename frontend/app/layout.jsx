import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast'; // ← ADD THIS

export const metadata = {
  title: 'MRI Parts Hub — New & Used Medical Equipment Marketplace',
  description: 'Buy and sell MRI machines, CT scanners, ultrasound, X-ray and medical parts worldwide.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        
        {/* ADD THIS: Global toast container */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: { fontWeight: 600, borderRadius: '8px' },
            success: { style: { background: '#dcfce7', color: '#166534' } },
            error:   { style: { background: '#fee2e2', color: '#991b1b' } }
          }}
        />
      </body>
    </html>
  );
}