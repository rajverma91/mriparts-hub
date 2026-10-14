USE mriparts_hub;

-- Add featured columns to listings
ALTER TABLE listings
  ADD COLUMN is_featured TINYINT(1) DEFAULT 0,
  ADD COLUMN featured_until DATETIME DEFAULT NULL,
  ADD INDEX idx_featured (is_featured, featured_until);

-- Payments table (log of every Stripe transaction)
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  listing_id INT NOT NULL,
  amount_cents INT NOT NULL,
  currency VARCHAR(8) DEFAULT 'usd',
  status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  stripe_session_id VARCHAR(255) DEFAULT NULL,
  stripe_payment_intent VARCHAR(255) DEFAULT NULL,
  kind ENUM('featured_listing','other') DEFAULT 'featured_listing',
  days INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME DEFAULT NULL,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_session (stripe_session_id)
);