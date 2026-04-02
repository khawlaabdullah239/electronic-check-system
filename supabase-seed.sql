-- =============================================
-- Sudanese Electronic Check System - Database Seed
-- Run this in Supabase SQL Editor
-- =============================================

-- Banks table
CREATE TABLE IF NOT EXISTS banks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Seed banks (only if empty)
INSERT INTO banks (name_ar, name_en)
SELECT * FROM (VALUES
  ('بنك الخرطوم', 'Bank of Khartoum'),
  ('بنك فيصل الإسلامي السوداني', 'Faisal Islamic Bank of Sudan'),
  ('بنك أم درمان الوطني', 'Omdurman National Bank'),
  ('بنك النيلين', 'Al Nilein Bank'),
  ('بنك السودان المركزي', 'Central Bank of Sudan'),
  ('المصرف الصناعي السوداني', 'Sudanese Industrial Bank'),
  ('بنك المزارع التجاري', 'Farmer Commercial Bank'),
  ('بنك الإدخار والتنمية الاجتماعية', 'Savings & Social Development Bank'),
  ('بنك البركة السوداني', 'Al Baraka Bank Sudan'),
  ('بنك التضامن الإسلامي', 'Tadamon Islamic Bank'),
  ('بنك الثروة الحيوانية والتعاوني', 'Animal Resources Bank'),
  ('بنك الإستثمار السوداني', 'Sudanese Investment Bank'),
  ('بنك التنمية التعاوني الإسلامي', 'Co-operative Development Bank'),
  ('بنك قطر الوطني - السودان', 'Qatar National Bank - Sudan'),
  ('بنك أبو ظبي الإسلامي - السودان', 'Abu Dhabi Islamic Bank - Sudan')
) AS v(name_ar, name_en)
WHERE NOT EXISTS (SELECT 1 FROM banks LIMIT 1);

-- Statuses table
CREATE TABLE IF NOT EXISTS statuses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  value text NOT NULL UNIQUE,
  label_ar text NOT NULL,
  label_en text NOT NULL,
  color text NOT NULL DEFAULT 'amber',
  created_at timestamptz DEFAULT now()
);

-- Seed statuses (only if empty)
INSERT INTO statuses (value, label_ar, label_en, color)
SELECT * FROM (VALUES
  ('pending', 'قيد الانتظار', 'Pending', 'amber'),
  ('cashed', 'مصروف', 'Cashed', 'emerald'),
  ('returned', 'مرتجع', 'Returned', 'red')
) AS v(value, label_ar, label_en, color)
WHERE NOT EXISTS (SELECT 1 FROM statuses LIMIT 1);

-- RLS policies
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Anyone can read banks" ON banks;
DROP POLICY IF EXISTS "Admins can insert banks" ON banks;
DROP POLICY IF EXISTS "Admins can update banks" ON banks;
DROP POLICY IF EXISTS "Admins can delete banks" ON banks;
DROP POLICY IF EXISTS "Anyone can read statuses" ON statuses;
DROP POLICY IF EXISTS "Admins can insert statuses" ON statuses;
DROP POLICY IF EXISTS "Admins can update statuses" ON statuses;
DROP POLICY IF EXISTS "Admins can delete statuses" ON statuses;

-- Read: anyone (including anon for public verification)
CREATE POLICY "Anyone can read banks" ON banks FOR SELECT USING (true);
CREATE POLICY "Anyone can read statuses" ON statuses FOR SELECT USING (true);

-- Write: only admins
CREATE POLICY "Admins can insert banks" ON banks FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update banks" ON banks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete banks" ON banks FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert statuses" ON statuses FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update statuses" ON statuses FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete statuses" ON statuses FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
