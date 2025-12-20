# PowerShell script to view database data
$env:PGPASSWORD = "Postgres@123"

Write-Host "=== CHECKING DATABASE TABLES ===" -ForegroundColor Green
psql -U postgres -h localhost -d my_project_db -c "\dt"

Write-Host "`n=== PATENTS DATA ===" -ForegroundColor Green
psql -U postgres -h localhost -d my_project_db -c "SELECT patent_id, id, title, assignee, status FROM patents LIMIT 10;"

Write-Host "`n=== TOTAL PATENTS COUNT ===" -ForegroundColor Green
psql -U postgres -h localhost -d my_project_db -c "SELECT COUNT(*) as total_patents FROM patents;"

Write-Host "`n=== USERS DATA ===" -ForegroundColor Green
psql -U postgres -h localhost -d my_project_db -c "SELECT id, email, first_name, last_name, is_verified FROM users LIMIT 10;"

Write-Host "`n=== TOTAL USERS COUNT ===" -ForegroundColor Green
psql -U postgres -h localhost -d my_project_db -c "SELECT COUNT(*) as total_users FROM users;"
