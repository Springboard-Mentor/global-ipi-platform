# Quick Backend Restart Script for Admin Login Fix
# Run this in PowerShell from backend/backend directory

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  RESTARTING BACKEND WITH ADMIN CONTROLLER         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$backendPath = "C:\Users\vikas\OneDrive\Desktop\New folder (2)\global-ipi-platform\backend\backend"

# Check if we're in the right directory
if (!(Test-Path "pom.xml")) {
    Write-Host "Error: Not in backend directory. Changing directory..." -ForegroundColor Red
    Set-Location $backendPath
}

Write-Host "Step 1: Cleaning previous build..." -ForegroundColor Yellow
mvn clean

Write-Host "`nStep 2: Compiling with Admin Controller..." -ForegroundColor Yellow
mvn compile -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Compilation successful!`n" -ForegroundColor Green
    Write-Host "Step 3: Starting Spring Boot..." -ForegroundColor Yellow
    Write-Host "Wait for 'Started BackendApplication' message`n" -ForegroundColor Cyan
    Write-Host "================================================================" -ForegroundColor Gray
    mvn spring-boot:run
} else {
    Write-Host "`n❌ Compilation failed! Check errors above." -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
