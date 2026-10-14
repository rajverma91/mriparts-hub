import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
      </body>
    </html>
  );
}