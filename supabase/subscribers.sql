-- Run this in Supabase SQL Editor to create the subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'alekotools.com',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow inserts from anon key (for the signup form)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Don't allow reading subscriber emails from the frontend
CREATE POLICY "No public read" ON subscribers
  FOR SELECT TO anon
  USING (false);
