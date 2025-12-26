# Firebase Functions Deployment Script
# This script deploys the deactivated accounts cleanup functions

Write-Host "🚀 Firebase Functions Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if firebase-tools is installed
Write-Host "Checking Firebase CLI installation..." -ForegroundColor Yellow
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue

if (-not $firebaseInstalled) {
    Write-Host "❌ Firebase CLI not found!" -ForegroundColor Red
    Write-Host "Installing Firebase Tools globally..." -ForegroundColor Yellow
    npm install -g firebase-tools
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Firebase Tools" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g firebase-tools" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Firebase Tools installed successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Firebase CLI found" -ForegroundColor Green
}

Write-Host ""

# Check if user is logged in
Write-Host "Checking Firebase authentication..." -ForegroundColor Yellow
firebase login:list 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Not logged in to Firebase" -ForegroundColor Yellow
    Write-Host "Logging in to Firebase..." -ForegroundColor Yellow
    firebase login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Firebase login failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Firebase authenticated" -ForegroundColor Green
Write-Host ""

# Navigate to firebase-functions directory
$functionsDir = Join-Path $PSScriptRoot "firebase-functions"
if (-not (Test-Path $functionsDir)) {
    Write-Host "❌ firebase-functions directory not found at: $functionsDir" -ForegroundColor Red
    exit 1
}

Set-Location $functionsDir
Write-Host "📁 Working directory: $functionsDir" -ForegroundColor Cyan
Write-Host ""

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "⚠️ package.json not found. Initializing Firebase Functions..." -ForegroundColor Yellow
    firebase init functions
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Firebase Functions initialization failed" -ForegroundColor Red
        exit 1
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Show deployment options
Write-Host "Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Deploy scheduled function only (recommended)" -ForegroundColor White
Write-Host "2. Deploy manual function only (for testing)" -ForegroundColor White
Write-Host "3. Deploy both functions" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select option (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Deploying scheduled cleanup function..." -ForegroundColor Cyan
        firebase deploy --only functions:deleteDeactivatedAccountsScheduled
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Deploying manual cleanup function..." -ForegroundColor Cyan
        firebase deploy --only functions:deleteDeactivatedAccountsManual
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Deploying all cleanup functions..." -ForegroundColor Cyan
        firebase deploy --only functions
    }
    "4" {
        Write-Host "Deployment cancelled" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
        exit 1
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Check Firebase Console → Functions to verify deployment" -ForegroundColor White
    Write-Host "2. Scheduled function runs daily at 2:00 AM UTC" -ForegroundColor White
    Write-Host "3. Manual function available at:" -ForegroundColor White
    Write-Host "   https://REGION-PROJECT_ID.cloudfunctions.net/deleteDeactivatedAccountsManual" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the error messages above for details" -ForegroundColor Yellow
    exit 1
}
