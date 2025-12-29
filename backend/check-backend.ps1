# Quick Backend Status Check
Write-Host "🔍 Checking Backend Status..." -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
try {
    Write-Host "Testing connection to http://localhost:8080..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/patent-filing/count" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is RUNNING!" -ForegroundColor Green
    Write-Host "   Patent count: $response" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Backend is NOT running or not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start the backend:" -ForegroundColor Yellow
    Write-Host "   1. Open a terminal in: backend\backend" -ForegroundColor White
    Write-Host "   2. Run: mvn spring-boot:run" -ForegroundColor White
    Write-Host ""
    exit
}

# Check patent filings
try {
    Write-Host "Fetching patent filings..." -ForegroundColor Yellow
    $patents = Invoke-RestMethod -Uri "http://localhost:8080/api/patent-filing/all" -Method GET
    Write-Host "✅ Found $($patents.Count) patent(s)" -ForegroundColor Green
    Write-Host ""
    
    if ($patents.Count -gt 0) {
        Write-Host "Recent Patents:" -ForegroundColor Cyan
        $patents | Select-Object -First 3 | ForEach-Object {
            Write-Host "  ID: $($_.id) | $($_.applicantName) | Status: $($_.status)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "⚠️  Could not fetch patents" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Backend check complete!" -ForegroundColor Green
