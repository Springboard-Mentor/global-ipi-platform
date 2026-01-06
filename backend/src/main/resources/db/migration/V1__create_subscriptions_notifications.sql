-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  ip_asset_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT ux_subscription UNIQUE (user_id, ip_asset_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  ip_asset_id BIGINT,
  message TEXT NOT NULL,
  type VARCHAR(50),
  timestamp TIMESTAMP NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications (timestamp);