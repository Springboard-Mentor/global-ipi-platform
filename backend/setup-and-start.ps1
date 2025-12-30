# Script to insert admin user and start backend

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Setting up Admin User" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Set PostgreSQL password
$env:PGPASSWORD = 'admin'

# PostgreSQL connection details
$pgHost = "localhost"
$pgPort = "5432"
$pgDatabase = "my_project_db"
$pgUser = "postgres"

Write-Host "Step 1: Inserting admin user into database..." -ForegroundColor Yellow

# Path to PostgreSQL bin (adjust if needed)
$psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"

if (Test-Path $psqlPath) {
    # Execute the SQL file
    $sqlFile = Join-Path $PSScriptRoot "insert-admin-user.sql"
    & $psqlPath -h $pgHost -p $pgPort -U $pgUser -d $pgDatabase -f $sqlFile
    
    Write-Host ""
    Write-Host "Admin user inserted successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Admin Credentials:" -ForegroundColor Cyan
    Write-Host "  Admin ID: 1" -ForegroundColor White
    Write-Host "  Name: Vikas" -ForegroundColor White
    Write-Host "  Email: vikaskumaryadav068@gmail.com" -ForegroundColor White
    Write-Host "  Password: admin123" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "psql.exe not found at $psqlPath" -ForegroundColor Red
    Write-Host "  Please update the path or run the SQL file manually" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Step 2: Starting Spring Boot backend..." -ForegroundColor Yellow
Write-Host ""

# Navigate to backend directory
Set-Location (Join-Path $PSScriptRoot "backend")

# Start Maven
Write-Host "Running: mvn spring-boot:run" -ForegroundColor Gray
mvn spring-boot:run
