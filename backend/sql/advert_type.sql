USE mriparts_hub;

ALTER TABLE listings
  ADD COLUMN advert_type ENUM('sell','buy','auction') DEFAULT 'sell',
  ADD INDEX idx_advert_type (advert_type);

-- Ensure all existing listings default to 'sell'
UPDATE listings SET advert_type = 'sell' WHERE advert_type IS NULL;