$env:PGPASSWORD = 'admin'

Write-Host "`n=== Adding Progress Tracker Columns ===" -ForegroundColor Cyan

# Add columns
psql -U postgres -d my_project_db -c @"
ALTER TABLE patent_filings
ADD COLUMN IF NOT EXISTS stage_1_filed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS stage_2_admin_review BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stage_3_technical_review BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stage_4_verification BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stage_5_granted BOOLEAN DEFAULT false;
"@

Write-Host "`n=== Updating Existing Records ===" -ForegroundColor Yellow
psql -U postgres -d my_project_db -c "UPDATE patent_filings SET stage_1_filed = true WHERE stage_1_filed IS NULL;"

Write-Host "`n=== Verification ===" -ForegroundColor Green
psql -U postgres -d my_project_db -c "SELECT id, invention_title, stage_1_filed, stage_2_admin_review, stage_3_technical_review, stage_4_verification, stage_5_granted FROM patent_filings LIMIT 3;"

Write-Host "`nDone!" -ForegroundColor Green
