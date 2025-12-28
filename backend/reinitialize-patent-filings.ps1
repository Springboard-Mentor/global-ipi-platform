# PowerShell script to reinitialize patent_filings table with updated schema
# This will DROP all existing data and recreate the table

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Patent Filings Table Reinitialization Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Database connection parameters
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "my_project_db"
$DB_USER = "postgres"

Write-Host "Database Configuration:" -ForegroundColor Yellow
Write-Host "  Host: $DB_HOST" -ForegroundColor Gray
Write-Host "  Port: $DB_PORT" -ForegroundColor Gray
Write-Host "  Database: $DB_NAME" -ForegroundColor Gray
Write-Host "  User: $DB_USER" -ForegroundColor Gray
Write-Host ""

# Prompt for password
$DB_PASSWORD = Read-Host "Enter PostgreSQL password for user '$DB_USER'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Set environment variable for password
$env:PGPASSWORD = $PlainPassword

Write-Host ""
Write-Host "⚠️  WARNING: This will DELETE ALL existing patent filing data!" -ForegroundColor Red
Write-Host "Are you sure you want to continue? (Type 'YES' to confirm)" -ForegroundColor Yellow
$confirmation = Read-Host

if ($confirmation -ne "YES") {
    Write-Host ""
    Write-Host "❌ Operation cancelled by user." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "📋 Step 1: Dropping existing patent_filings table..." -ForegroundColor Cyan

# Execute the SQL file
try {
    $sqlFile = "create-patent-filing-table.sql"
    
    if (-not (Test-Path $sqlFile)) {
        Write-Host "❌ Error: SQL file '$sqlFile' not found!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "   Executing SQL script..." -ForegroundColor Gray
    
    # Run psql command
    $output = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $sqlFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Table reinitialized successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Output:" -ForegroundColor Yellow
        Write-Host $output -ForegroundColor Gray
    } else {
        Write-Host "❌ Error executing SQL script!" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    $env:PGPASSWORD = $null
}

Write-Host ""
Write-Host "📊 Step 2: Verifying table structure..." -ForegroundColor Cyan

# Set password again for verification query
$env:PGPASSWORD = $PlainPassword

try {
    $verifyQuery = "SELECT COUNT(*) as column_count FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'patent_filings';"
    $columnCount = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c $verifyQuery 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Table verified: $($columnCount.Trim()) columns created" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not verify table structure" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Verification skipped: $($_.Exception.Message)" -ForegroundColor Yellow
} finally {
    $env:PGPASSWORD = $null
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Database reinitialization completed!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your Spring Boot backend application" -ForegroundColor Gray
Write-Host "  2. Test the patent filing form with all new fields" -ForegroundColor Gray
Write-Host "  3. Verify data is being saved correctly" -ForegroundColor Gray
Write-Host ""
