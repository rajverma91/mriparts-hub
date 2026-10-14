"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import styles from '../app/css/AuctionBanner.module.css';

// 1. Dynamically import the Slider component (Disables SSR)
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const AuctionBanner = () => {
  
  // 2. Slick Slider Settings
  const settings = {
    dots: false,           // We are using our own arrows, so set dots to false
    infinite: true,        // Loop back to the start
    speed: 500,            // Transition speed in ms
    slidesToShow: 1,       // Show one full banner at a time
    slidesToScroll: 1,     // Scroll one banner at a time
    arrows: true,          // Enable default arrows (or set false if using your own)
    prevArrow: <button className={styles.customArrow}>&#10094;</button>,
    nextArrow: <button className={styles.customArrow}>&#10095;</button>,
  };

  return (
    <div className={styles.sliderWrapper}>
      <Slider {...settings}>
        
        {/* ==========================================
            SLIDE 1: USED HOSPITAL BEDS
        ========================================== */}
        <div className={styles.slide}>
          <div className={`${styles.bannerContainer} ${styles.bgLightBlue}`}>
            <div className={styles.hbIconBox}>
              <div className={styles.hbPlusIcon}>+</div>
              <div className={styles.hbBedIcon}>🛏️</div>
            </div>
            <div className={styles.hbTextSection}>
              <h2>USED HOSPITALBEDS<br/>AND MORE!</h2>
              <div className={styles.hbUrlBox}>USED-HOSPITALBEDS.COM</div>
              <p>We make hospital equipment available for everyone!</p>
            </div>
            <div className={styles.hbImagesSection}>
              <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=150&h=150" alt="Cart" />
              <img src="https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=150&h=150" alt="Bed" />
              <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=150&h=150" alt="Stretcher" />
            </div>
            <div className={styles.hbInfoSection}>
              <div className={styles.hbTags}>
                <span>Affordable</span>
                <span>Refurbished</span>
                <span>Shipping Worldwide</span>
              </div>
              <div className={styles.hbContact}>
                <p>✉️ info@used-hospitalbeds.com</p>
                <p>📞 +31 (0) 85 2738 882</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            SLIDE 2: 3MA AUCTIONS
        ========================================== */}
        <div className={styles.slide}>
          <div className={`${styles.bannerContainer} ${styles.bgDarkBlue}`}>
            <div className={styles.maTextLeft}>
              <p>POWERING THE <span className={styles.greenText}>GLOBAL CIRCULAR ECONOMY</span> FOR SURPLUS MEDICAL EQUIPMENT.</p>
            </div>
            <div className={styles.maCenter}>
              <h1><span className={styles.greenText}>+</span>3MA</h1>
              <p className={styles.maSub}>A TB AUCTIONS BRAND</p>
              <div className={styles.maBottomText}>EUROPE'S LEADING MEDICAL EQUIPMENT AUCTION HOUSE</div>
              <div className={styles.maGlobeGraphic}></div>
            </div>
            <div className={styles.maFeaturesRight}>
              <div className={styles.maFeatureItem}>
                <span className={styles.maFeatureIcon}>👥</span>
                <p>FULL INTERNATIONAL BUYER SUPPORT</p>
              </div>
              <div className={styles.maFeatureItem}>
                <span className={styles.maFeatureIcon}>🌐</span>
                <p>BASED IN MULTIPLE EUROPEAN LOCATIONS</p>
              </div>
              <div className={styles.maFeatureItem}>
                <span className={styles.maFeatureIcon}>🔨</span>
                <p>OVER 5000 LOTS PER MONTH</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            SLIDE 3: MEDIPROMA
        ========================================== */}
        <div className={styles.slide}>
          <div className={`${styles.bannerContainer} ${styles.bgWhite}`}>
            <div className={styles.mpLogoSection}>
              <div className={styles.mpLogoGraphic}>
                <div className={styles.mpCircle}></div>
                <h2>Mediproma</h2>
              </div>
              <p>Project Management<br/>Rigging, Crating, Shipping</p>
            </div>
            <div className={styles.mpEquipmentSection}>
              <div className={styles.mpItem}>
                <div className={styles.mpVerticalText}>Imaging</div>
                <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=150&h=200" alt="Imaging" />
              </div>
              <div className={styles.mpItem}>
                <div className={styles.mpVerticalText}>Ultrasound</div>
                <img src="https://images.unsplash.com/photo-1516549655169-df83a25e10bf?auto=format&fit=crop&q=80&w=150&h=200" alt="Ultrasound" />
              </div>
              <div className={styles.mpItem}>
                <div className={styles.mpVerticalText}>Diagnostic</div>
                <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=150&h=200" alt="Diagnostic" />
              </div>
              <div className={styles.mpItem}>
                <div className={styles.mpVerticalText}>Treatment</div>
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=150&h=200" alt="Treatment" />
              </div>
            </div>
            <div className={styles.mpCtaSection}>
              <button className={styles.mpButton}>
                See All<br/>Equipment
              </button>
            </div>
          </div>
        </div>

      </Slider>
    </div>
  );
};

export default AuctionBanner;