# Script to clear sample data from database
$env:PGPASSWORD = "Postgres@123"

Write-Host "=== CLEARING SAMPLE DATA FROM DATABASE ===" -ForegroundColor Yellow

# Clear all existing patents
Write-Host "`nClearing patents table..." -ForegroundColor Cyan
psql -U postgres -h localhost -d my_project_db -c "DELETE FROM patents WHERE api_source = 'Local Database' OR api_source = 'Local Sample Data' OR api_source = 'SerpAPI';"

Write-Host "`nDatabase cleaned successfully!" -ForegroundColor Green

Write-Host "`n=== CURRENT DATABASE STATUS ===" -ForegroundColor Cyan
Write-Host "`nPatents count:" -ForegroundColor Yellow
psql -U postgres -h localhost -d my_project_db -c "SELECT COUNT(*) as total_patents FROM patents;"

Write-Host "`nUsers count:" -ForegroundColor Yellow
psql -U postgres -h localhost -d my_project_db -c "SELECT COUNT(*) as total_users FROM users;"

Write-Host "`n✓ Database is now clean and ready for real data only!" -ForegroundColor Green
