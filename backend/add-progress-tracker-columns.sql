-- Add Progress Tracker columns to patent_filings table
-- These 5 boolean columns track the patent application progress

ALTER TABLE patent_filings
ADD COLUMN IF NOT EXISTS stage_1_filed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS stage_2_admin_review BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stage_3_technical_review BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stage_4_verification BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stage_5_granted BOOLEAN DEFAULT false;

-- Update existing records to set stage_1_filed to true
UPDATE patent_filings SET stage_1_filed = true WHERE stage_1_filed IS NULL;

-- Display the results
SELECT id, applicant_name, invention_title, 
       stage_1_filed, stage_2_admin_review, stage_3_technical_review, 
       stage_4_verification, stage_5_granted
FROM patent_filings
ORDER BY created_at DESC;
