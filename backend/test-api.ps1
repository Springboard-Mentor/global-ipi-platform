# Test Patent Filing API
# This script tests the patent filing submission endpoint

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Patent Filing API Test Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Checking if backend is running..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    Write-Host "Please start the backend first:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  .\mvnw spring-boot:run" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Test data file
$testDataFile = "backend\test-patent-filing.json"

# Check if test data file exists
if (-not (Test-Path $testDataFile)) {
    Write-Host "❌ Test data file not found: $testDataFile" -ForegroundColor Red
    exit 1
}

Write-Host "Reading test data from: $testDataFile" -ForegroundColor Yellow
$testData = Get-Content $testDataFile -Raw

Write-Host ""
Write-Host "Submitting patent filing..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/patent-filing/submit" `
        -Method Post `
        -ContentType "application/json" `
        -Body $testData `
        -ErrorAction Stop
    
    Write-Host ""
    Write-Host "✅ Patent filing submitted successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host "  Success: $($response.success)" -ForegroundColor White
    Write-Host "  Message: $($response.message)" -ForegroundColor White
    Write-Host "  Filing ID: $($response.filingId)" -ForegroundColor White
    Write-Host ""
    
    # Fetch the submitted filing
    Write-Host "Fetching submitted filing..." -ForegroundColor Yellow
    $filingId = $response.filingId
    
    try {
        $filing = Invoke-RestMethod -Uri "http://localhost:8080/api/patent-filing/$filingId" `
            -Method Get `
            -ErrorAction Stop
        
        Write-Host ""
        Write-Host "✅ Filing retrieved successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Filing Details:" -ForegroundColor Cyan
        Write-Host "  ID: $($filing.id)" -ForegroundColor White
        Write-Host "  User Email: $($filing.userEmail)" -ForegroundColor White
        Write-Host "  Applicant: $($filing.applicantName)" -ForegroundColor White
        Write-Host "  Invention: $($filing.inventionTitle)" -ForegroundColor White
        Write-Host "  Field: $($filing.inventionField)" -ForegroundColor White
        Write-Host "  Patent Type: $($filing.patentType)" -ForegroundColor White
        Write-Host "  Filing Type: $($filing.filingType)" -ForegroundColor White
        Write-Host "  Claims: $($filing.numberOfClaims)" -ForegroundColor White
        Write-Host "  Drawings: $($filing.numberOfDrawings)" -ForegroundColor White
        Write-Host "  Payment Amount: ₹$($filing.paymentAmount)" -ForegroundColor White
        Write-Host "  Payment Status: $($filing.paymentStatus)" -ForegroundColor White
        Write-Host "  Status: $($filing.status)" -ForegroundColor White
        Write-Host "  Created: $($filing.createdAt)" -ForegroundColor White
        Write-Host ""
        
    } catch {
        Write-Host "❌ Failed to retrieve filing" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Failed to submit patent filing" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Details:" -ForegroundColor Yellow
        Write-Host $errorBody -ForegroundColor White
        Write-Host ""
    }
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Prompt to check database
Write-Host "To verify in database, run:" -ForegroundColor Yellow
Write-Host "  psql -U postgres -d my_project_db" -ForegroundColor White
Write-Host "  SELECT * FROM patent_filings ORDER BY created_at DESC LIMIT 1;" -ForegroundColor White
Write-Host ""
