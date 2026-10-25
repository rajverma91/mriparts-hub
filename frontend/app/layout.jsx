import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'MRI & CT Parts, Accessories and Repair Services | MRI Parts Hub',
  description: 'Find MRI/CT parts, accessories, replacement components, and repair services at MRI Parts Hub. Connect with suppliers for your imaging equipment needs.',
  keywords: 'MRI parts, MRI accessories, CT scanner parts, MRI safety products, CT parts, MRI equipment services, MRI parts repair, refurbished MRI parts, MRI Rental, MRI Parts Hub',
  openGraph: {
    title: 'MRI & CT Parts, Accessories and Repair Services',
    description: 'Find MRI/CT parts, accessories, replacement components, and repair services at MRI Parts Hub.',
    url: 'https://mripartshub.com',
    siteName: 'MRI Parts Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRI & CT Parts, Accessories and Repair Services',
    description: 'Find MRI/CT parts, accessories, replacement components, and repair services at MRI Parts Hub.',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
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