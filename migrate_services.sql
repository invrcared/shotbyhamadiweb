-- Services table migration — adds new business-critical fields
-- Run: npx wrangler d1 execute shotbyhamadi-db --remote --file=./migrate_services.sql

ALTER TABLE Services ADD COLUMN category TEXT DEFAULT 'General';
ALTER TABLE Services ADD COLUMN travel_fee REAL DEFAULT 0;
ALTER TABLE Services ADD COLUMN policy_note TEXT DEFAULT '';
ALTER TABLE Services ADD COLUMN is_active INTEGER DEFAULT 1;
