"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import styles from '../app/css/AuctionBanner.module.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Slider = dynamic(() => import('react-slick'), { ssr: false });

const PrevArrow = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    type="button"
    className={`${styles.customArrow} ${styles.customArrowPrev}`}
    aria-label="Previous slide"
  >
    &#10094;
  </button>
);

const NextArrow = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    type="button"
    className={`${styles.customArrow} ${styles.customArrowNext}`}
    aria-label="Next slide"
  >
    &#10095;
  </button>
);

// Your images — one shows at a time
const images = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200&h=240",
  "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=1200&h=240",
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200&h=240",
];

const AuctionBanner = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,       // single image at a time
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrapper}>
        <Slider {...settings}>
          {images.map((src, i) => (
            <div key={i} className={styles.slide}>
              <div className={styles.imageCard}>
                <img src={src} alt={`Slide ${i + 1}`} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default AuctionBanner;