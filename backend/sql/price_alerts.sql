USE mriparts_hub;

CREATE TABLE IF NOT EXISTS price_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  listing_id INT NOT NULL,
  old_price  DECIMAL(12,2) NOT NULL,
  new_price  DECIMAL(12,2) NOT NULL,
  sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_alert (user_id, listing_id, old_price, new_price),
  INDEX idx_user (user_id),
  INDEX idx_listing (listing_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);