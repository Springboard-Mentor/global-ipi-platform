# Security Check Script
# Run this before committing to ensure no sensitive files are exposed

Write-Host "Running Security Check..." -ForegroundColor Cyan
Write-Host ""

$hasIssues = $false

# Check if sensitive files exist but are not in .gitignore
Write-Host "Checking for sensitive files..." -ForegroundColor Yellow

$sensitiveFiles = @(
    "frontend\.env",
    "frontend\dashboard\.env",
    "frontend\src\firebase.js",
    "frontend\dashboard\src\firebase.js",
    "backend\backend\src\main\resources\application-secrets.properties"
)

foreach ($file in $sensitiveFiles) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        # Check if file is tracked by git
        $gitStatus = git ls-files $fullPath 2>$null
        if ($gitStatus) {
            Write-Host "CRITICAL: $file is tracked by Git!" -ForegroundColor Red
            Write-Host "   Run: git rm --cached $file" -ForegroundColor Yellow
            $hasIssues = $true
        } else {
            Write-Host "OK: $file exists and is properly ignored" -ForegroundColor Green
        }
    } else {
        Write-Host "INFO: $file not found (expected for new setup)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Checking for example/template files..." -ForegroundColor Yellow

$templateFiles = @(
    "frontend\.env.example",
    "frontend\.env.template",
    "frontend\dashboard\.env.example",
    "frontend\dashboard\.env.template",
    "backend\backend\src\main\resources\application-secrets.properties.example"
)

$templatesMissing = $false
foreach ($template in $templateFiles) {
    $fullPath = Join-Path $PSScriptRoot $template
    if (Test-Path $fullPath) {
        Write-Host "OK: $template exists" -ForegroundColor Green
    } else {
        Write-Host "INFO: $template missing" -ForegroundColor Yellow
        $templatesMissing = $true
    }
}

Write-Host ""
Write-Host "Checking git status for staged files..." -ForegroundColor Yellow

$stagedFiles = git diff --cached --name-only
if ($stagedFiles) {
    foreach ($file in $stagedFiles) {
        if ($file -match "\.env$|firebase\.js$|application-secrets\.properties$") {
            Write-Host "CRITICAL: Sensitive file staged for commit: $file" -ForegroundColor Red
            Write-Host "   Run: git reset HEAD $file" -ForegroundColor Yellow
            $hasIssues = $true
        }
    }
}

Write-Host ""
Write-Host "Checking for hardcoded API keys in code..." -ForegroundColor Yellow

$codeFiles = Get-ChildItem -Recurse -Include *.jsx,*.js,*.java,*.properties -Exclude node_modules,target,dist,build
$keyPatterns = @(
    "AIzaSy[a-zA-Z0-9_-]{33}",  # Google API Key
    "rzp_(test|live)_[a-zA-Z0-9]{14}",  # Razorpay
    "[0-9]{12}",  # Firebase Sender ID pattern
    "karm fdlu osvr xrnt"  # Email app password
)

$foundHardcoded = $false
foreach ($file in $codeFiles) {
    if ($file.FullName -notmatch "node_modules|target|dist|build|\.env|application-secrets\.properties") {
        $content = Get-Content $file.FullName -Raw
        foreach ($pattern in $keyPatterns) {
            if ($content -match $pattern) {
                # Exclude template files and example files
                if ($file.Name -notmatch "template|example") {
                    Write-Host "⚠️  Possible hardcoded key in: $($file.Name)" -ForegroundColor Yellow
                    $foundHardcoded = $true
                }
            }
        }
    }
}

if (-not $foundHardcoded) {
    Write-Host "OK: No obvious hardcoded keys found in code" -ForegroundColor Green
}

Write-Host ""
Write-Host "" -ForegroundColor Cyan
if ($hasIssues) {
    Write-Host "Security issues found!" -ForegroundColor Red
    Write-Host "Please fix the issues above before committing." -ForegroundColor Red
    Write-Host "Read SECURITY-GUIDE.md for more information." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "Security check passed!" -ForegroundColor Green
    Write-Host "You can safely commit your changes." -ForegroundColor Green
    if ($templatesMissing) {
        Write-Host ""
        Write-Host "Note: Some template files are missing." -ForegroundColor Yellow
    }
    exit 0
}
