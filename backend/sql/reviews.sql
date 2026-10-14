USE mriparts_hub;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  seller_id  INT NOT NULL,
  reviewer_name VARCHAR(120) NOT NULL,
  reviewer_email VARCHAR(180) NOT NULL,
  rating TINYINT NOT NULL,
  title VARCHAR(180) DEFAULT NULL,
  comment TEXT NOT NULL,
  -- ratings broken down (optional, but nice)
  rating_recommend TINYINT DEFAULT NULL,
  rating_value     TINYINT DEFAULT NULL,
  rating_quality   TINYINT DEFAULT NULL,
  -- moderation
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME DEFAULT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id)  REFERENCES users(id)    ON DELETE CASCADE,
  INDEX idx_listing (listing_id, status),
  INDEX idx_seller  (seller_id, status)
);