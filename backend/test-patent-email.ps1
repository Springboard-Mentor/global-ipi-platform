# Test Patent Grant Email Notification
# This script helps you test the email functionality

Write-Host "🧪 Patent Grant Email Test Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get all patents
Write-Host "📋 Step 1: Fetching all patents..." -ForegroundColor Yellow
try {
    $patents = Invoke-RestMethod -Uri "http://localhost:8080/api/patent-filing/all" -Method GET
    Write-Host "✅ Found $($patents.Count) patent(s)" -ForegroundColor Green
    Write-Host ""
    
    if ($patents.Count -eq 0) {
        Write-Host "❌ No patents found. Please submit a patent filing first." -ForegroundColor Red
        exit
    }
    
    # Display patents
    Write-Host "Available Patents:" -ForegroundColor Cyan
    $patents | ForEach-Object {
        Write-Host "  ID: $($_.id) | $($_.applicantName) | $($_.applicantEmail) | Status: $($_.status)" -ForegroundColor White
        Write-Host "    Title: $($_.inventionTitle)" -ForegroundColor Gray
        Write-Host "    Stages: Filed=$($_.stage1Filed) Admin=$($_.stage2AdminReview) Tech=$($_.stage3TechnicalReview) Verify=$($_.stage4Verification) Granted=$($_.stage5Granted)" -ForegroundColor Gray
        Write-Host ""
    }
} catch {
    Write-Host "❌ Failed to fetch patents. Is the backend running?" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Step 2: Select patent
Write-Host "📝 Step 2: Select Patent to Grant" -ForegroundColor Yellow
$patentId = Read-Host "Enter Patent ID to grant (or press Enter for first patent)"

if ([string]::IsNullOrWhiteSpace($patentId)) {
    $patentId = $patents[0].id
    Write-Host "Using first patent: ID $patentId" -ForegroundColor Cyan
}

# Find the selected patent
$selectedPatent = $patents | Where-Object { $_.id -eq [int]$patentId }
if (-not $selectedPatent) {
    Write-Host "❌ Patent ID $patentId not found!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Selected Patent Details:" -ForegroundColor Cyan
Write-Host "  ID: $($selectedPatent.id)" -ForegroundColor White
Write-Host "  Title: $($selectedPatent.inventionTitle)" -ForegroundColor White
Write-Host "  Applicant: $($selectedPatent.applicantName)" -ForegroundColor White
Write-Host "  Email: $($selectedPatent.applicantEmail)" -ForegroundColor Green
Write-Host "  Current Status: $($selectedPatent.status)" -ForegroundColor White
Write-Host ""

# Step 3: Confirm
Write-Host "⚠️  This will:" -ForegroundColor Yellow
Write-Host "  1. Set all 5 stages to complete" -ForegroundColor White
Write-Host "  2. Update status to 'Granted'" -ForegroundColor White
Write-Host "  3. Send email to: $($selectedPatent.applicantEmail)" -ForegroundColor Green
Write-Host ""

$confirm = Read-Host "Do you want to proceed? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Cancelled." -ForegroundColor Red
    exit
}

# Step 4: Grant Patent
Write-Host ""
Write-Host "🚀 Step 3: Granting Patent..." -ForegroundColor Yellow

$body = @{
    stage1Filed = $true
    stage2AdminReview = $true
    stage3TechnicalReview = $true
    stage4Verification = $true
    stage5Granted = $true
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:8080/api/patent-filing/$patentId/stages" `
        -Method PUT `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body
    
    Write-Host ""
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
    Write-Host "Status: $($result.status)" -ForegroundColor White
    Write-Host "All Stages Complete: $($result.allStagesComplete)" -ForegroundColor White
    Write-Host "Email Sent: $($result.emailSent)" -ForegroundColor $(if ($result.emailSent) { "Green" } else { "Yellow" })
    Write-Host "Message: $($result.message)" -ForegroundColor White
    Write-Host ""
    
    if ($result.emailSent) {
        Write-Host "📧 Email sent to: $($selectedPatent.applicantEmail)" -ForegroundColor Green
        Write-Host "   Check the inbox (and spam folder)" -ForegroundColor Cyan
    } else {
        Write-Host "ℹ️  Email was not sent. Possible reasons:" -ForegroundColor Yellow
        Write-Host "   - Patent was already granted before" -ForegroundColor White
        Write-Host "   - Email configuration issue" -ForegroundColor White
        Write-Host "   - Check backend logs for details" -ForegroundColor White
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check if backend is running" -ForegroundColor White
    Write-Host "2. Verify email configuration in application.properties" -ForegroundColor White
    Write-Host "3. Check backend console logs" -ForegroundColor White
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host ""

# Optional: Reset the patent
Write-Host "🔄 Do you want to reset the patent for another test? (yes/no)" -ForegroundColor Yellow
$reset = Read-Host

if ($reset -eq "yes") {
    Write-Host "Resetting patent stages..." -ForegroundColor Cyan
    
    $resetBody = @{
        stage1Filed = $true
        stage2AdminReview = $false
        stage3TechnicalReview = $false
        stage4Verification = $false
        stage5Granted = $false
    } | ConvertTo-Json
    
    try {
        $resetResult = Invoke-RestMethod -Uri "http://localhost:8080/api/patent-filing/$patentId/stages" `
            -Method PUT `
            -Headers @{"Content-Type"="application/json"} `
            -Body $resetBody
        
        Write-Host "✅ Patent reset successfully! You can test again." -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to reset patent: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Thank you for testing! 🎉" -ForegroundColor Cyan
