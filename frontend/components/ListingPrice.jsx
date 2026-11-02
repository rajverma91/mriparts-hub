'use client';
import { useState } from 'react';
import RequestQuoteModal from './RequestQuoteModal';

export default function ListingPrice({ item }) {
  const [modalOpen, setModalOpen] = useState(false);
  const price = Number(item.price) || 0;

  return (
    <>
      <div style={{ fontSize: 32, color: '#0d6efd', fontWeight: 800, margin: '10px 0' }}>
        {price > 0 ? (
          <>{item.currency} {price.toLocaleString()}</>
        ) : (
          <button 
            onClick={() => setModalOpen(true)}
            className="btn"
            style={{ fontSize: 18, padding: '10px 24px' }}
          >
            Request Quote
          </button>
        )}
      </div>

      {/* Render the Popup */}
      <RequestQuoteModal 
        listingId={item.id} 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
}