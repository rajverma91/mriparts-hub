import React from 'react';
import styles from '../app/css/WhatIsBimedis.module.css';
import homePick1 from '../app/img/home-pick-1.jpg';

const WhatIsBimedis = () => {
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.container}>
        
        {/* Left Column: Text Content */}
        <div className={styles.textColumn}>
          
          {/* Section 1: What is Bimedis? */}
          <h2 className={styles.mainHeading}>About MRI Parts Hub</h2>
          
          <p className={styles.paragraph}>
            MRI Parts Hub is an online marketplace for buying and selling new, used, and refurbished MRI and CT equipment, parts, and accessories, as well as MRI safety products and medical imaging services. We connect healthcare facilities, imaging centers, medical equipment suppliers, service providers, and industry professionals through a convenient platform dedicated to the medical imaging industry.
          </p>

          <p className={styles.paragraph}>
           Whether you are looking for MRI or CT replacement parts, equipment accessories, pre-owned imaging equipment, MRI safety products, MRI parts repair services, or equipment leasing options, MRI Parts Hub makes it easier to find the products and services you need.
          </p>

          <p className={styles.paragraph}>
            Our marketplace allows buyers to explore listings by product category, manufacturer, model, equipment condition, price, and other relevant specifications. Users can also find MRI parts repair providers, explore leasing services, and connect with suppliers and service professionals. Sellers and service providers can list their available inventory and services to reach potential customers across the medical imaging industry.
          </p>
          <p className={styles.paragraph}>
           From MRI and CT parts to essential accessories, MRI safety solutions, repair services, and leasing options,<strong> MRI Parts Hub brings medical imaging products, services, and industry professionals together in one convenient marketplace.</strong> 
          </p>
          <p className={styles.paragraph}>
           MRI Parts Hub — Your Marketplace for MRI & CT Parts, Accessories, Equipment, Repairs, Leasing, and MRI Safety Products.
          </p>

          {/* Section 2: Our advantages */}
        

        </div>

        {/* Right Column: Image */}
        <div className={styles.imageColumn}>
          {/* 
            Using a standard img tag for simplicity. 
            Replace the src with your actual medical room image.
          */}
         <img 
          src={homePick1.src} 
          alt="Modern Medical Equipment Room" 
          className={styles.featureImage}
        />
        </div>

      </div>
      <div className='fullSectionWrap'>
         <h2 className={styles.subHeading}>Our Advantages</h2>
          
          <p className={styles.paragraph}>
            As a <strong> B2B and B2C manufacturer, supplier, or service provider, you want to increase your online visibility, build a strong brand reputation, and reach the right customers. MRI Parts Hub</strong> provides a dedicated marketplace to help you promote your products and services, connect with potential buyers, and expand your reach across the medical imaging industry. 
          </p>
          <p className={styles.paragraph}>
          Whether you manufacture, supply, repair, or lease MRI and CT equipment, parts, and accessories, or offer MRI safety products and related services, MRI Parts Hub helps you showcase your offerings to healthcare facilities, hospitals, imaging centers, medical equipment dealers, service companies, and individual buyers.
          </p>
          <p className={styles.paragraph}>
          Our platform supports both <strong> business-to-business (B2B) and business-to-consumer (B2C) </strong>opportunities, helping manufacturers and suppliers increase product exposure, generate business inquiries, connect with customers, and discover new growth opportunities in the MRI and CT marketplace.
          </p>
          <p className={styles.paragraph}>
          MRI Parts Hub — Helping Medical Imaging Businesses Connect, Promote, and Grow.
          </p>
</div>
    </section>
  );
};

export default WhatIsBimedis;