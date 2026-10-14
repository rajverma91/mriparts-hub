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
          <h2 className={styles.mainHeading}>What is Bimedis?</h2>
          
          <p className={styles.paragraph}>
            <strong>Bimedis</strong> is a <strong>Medical</strong> and <strong>Hospital Equipment Marketplace</strong> for <strong>New</strong> and <strong>Used</strong> Medical Equipment for sale or <strong>Refurbished</strong> Medical Equipment. We also offer Medical Equipment related <strong>Services</strong> Directory. You can <strong>Buy</strong> & <strong>Sell</strong> <strong>New</strong> and <strong>Pre-Owned</strong> Medical <strong>Equipment</strong> and Medical <strong>Products</strong>.
          </p>

          <p className={styles.paragraph}>
            <strong>Bimedis</strong> provides more than, <strong>390 000 Offers</strong>. You can find the 2nd hand medical <strong>equipment</strong>, Medical Device <strong>Companies</strong>, Home Medical <strong>Devices</strong>, Hospital Medical Equipment, Hospital <strong>Instruments</strong> and more Medical Equipment. List your Hospital Equipment and Medical Equipment for <strong>sale</strong> or <strong>wanted</strong>.
          </p>

          <p className={styles.paragraph}>
            <strong>Bimedis</strong> is a classified ads platform popular with many doctors. A convenient ad search system is provided to ensure quick access to necessary Medical Instrument, that’s why it has become even easier to <strong>Buy Cheap Used</strong> Medical Equipment. The search results list provides the possibility to select the merchandise category, manufacturer name, machine model, and its manufacturing date. Besides, it also allows setting the price range, specifying equipment condition and the supplier’s country of origin.
          </p>

          {/* Section 2: Our advantages */}
          <h2 className={styles.subHeading}>Our advantages</h2>
          
          <p className={styles.paragraph}>
            As a <strong>B2B</strong> manufacturer or supplier you want to be sure your company has an online visibility and a strong reputation. Bimedis <strong>B2B</strong> Advertising Solutions will help you to promote your products and your brand position in <strong>B2B</strong> medical marketplace globally with <strong>2M</strong> unique visitors per year, it is more than <strong>MEDICA</strong> Trade Fair Düsseldorf visits at <strong>16x</strong>.
          </p>

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
    </section>
  );
};

export default WhatIsBimedis;