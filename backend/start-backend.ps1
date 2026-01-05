# Backend Startup Script for Chatbot Testing
# This script ensures a clean start of the Spring Boot backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Chatbot Backend Startup Script" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Java processes
Write-Host "1. Stopping any existing Java processes..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Navigate to backend directory
$backendPath = "C:\Users\vikas\OneDrive\Desktop\New folder (2)\global-ipi-platform\backend"
Set-Location $backendPath

Write-Host "2. Starting Spring Boot backend..." -ForegroundColor Yellow
Write-Host "   Location: $backendPath" -ForegroundColor Gray
Write-Host "   Port: 8080" -ForegroundColor Gray
Write-Host ""

# Start the backend
Write-Host "3. Executing: mvn spring-boot:run" -ForegroundColor Yellow
Write-Host "   (This may take 30-60 seconds to start)" -ForegroundColor Gray
Write-Host ""

mvn spring-boot:run
