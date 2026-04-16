-- Run this in Supabase SQL Editor to create the affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  handle text NOT NULL,
  platform text DEFAULT 'tiktok',
  preferred_tool text DEFAULT 'any',
  code text UNIQUE NOT NULL,
  referral_link text NOT NULL,
  status text DEFAULT 'active',
  referrals int DEFAULT 0,
  earnings_cents int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Anyone can sign up (insert)
CREATE POLICY "Allow public inserts" ON affiliates
  FOR INSERT WITH CHECK (true);

-- Anyone can read (for checking if code exists)
CREATE POLICY "Allow public reads" ON affiliates
  FOR SELECT USING (true);
