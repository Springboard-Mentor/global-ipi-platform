# Check patent filings in the database
$env:PGPASSWORD = 'admin'

Write-Host "`n=== Checking Patent Filings ===" -ForegroundColor Cyan

# Count total filings
$count = psql -U postgres -d my_project_db -t -c "SELECT COUNT(*) FROM patent_filings;"
Write-Host "Total patent filings: $($count.Trim())" -ForegroundColor Yellow

# Show recent filings with user info
Write-Host "`n=== Recent Filings ===" -ForegroundColor Cyan
psql -U postgres -d my_project_db -c "SELECT id, user_id, user_email, applicant_email, applicant_name, invention_title, status FROM patent_filings ORDER BY created_at DESC LIMIT 5;"

Write-Host "`n=== User IDs in Database ===" -ForegroundColor Cyan
psql -U postgres -d my_project_db -c "SELECT DISTINCT user_id, user_email FROM patent_filings;"
