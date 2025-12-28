-- Set initial stage for existing patent filings
UPDATE patent_filings 
SET stage_1_filed = true 
WHERE stage_1_filed IS NULL;

-- Verify the update
SELECT id, title, stage_1_filed, stage_2_admin_review, stage_3_technical_review, 
       stage_4_verification, stage_5_granted 
FROM patent_filings;
