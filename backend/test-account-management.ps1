# Account Management Testing Script
# This script helps verify the new account management features

Write-Host "🧪 Account Management Testing Guide" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

function Show-Test {
    param(
        [string]$TestName,
        [string]$Instructions,
        [string]$ExpectedResult
    )
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "TEST: $TestName" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Instructions:" -ForegroundColor Cyan
    Write-Host "   $Instructions" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ Expected Result:" -ForegroundColor Green
    Write-Host "   $ExpectedResult" -ForegroundColor White
    Write-Host ""
    
    $result = Read-Host "Did the test PASS? (y/n/skip)"
    
    if ($result -eq "y") {
        Write-Host "✅ TEST PASSED" -ForegroundColor Green
        $script:testsPassed++
    } elseif ($result -eq "n") {
        Write-Host "❌ TEST FAILED" -ForegroundColor Red
        $script:testsFailed++
        $details = Read-Host "Enter failure details (optional)"
        if ($details) {
            Write-Host "   Details: $details" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⏭️ TEST SKIPPED" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "This script will guide you through testing all new features." -ForegroundColor White
Write-Host "Make sure your development server is running before starting." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to start testing"
Write-Host ""

# Test 1: Quick Logout
Show-Test `
    -TestName "Quick Logout Button" `
    -Instructions "Navigate to Settings → Account Management. Click 'Quick Logout' button." `
    -ExpectedResult "You should be logged out INSTANTLY with NO confirmation dialog and redirected to login page."

# Test 2: Deactivate UI
Show-Test `
    -TestName "Deactivate Account UI" `
    -Instructions "After logging back in, go to Settings → Account Management → Danger Zone. Check the deactivation section." `
    -ExpectedResult "Should see 3 bullet points explaining: immediate deactivation, 30-day reactivation window, auto-delete after 30 days."

# Test 3: Deactivate Action
Show-Test `
    -TestName "Deactivate Account Action" `
    -Instructions "Click 'Deactivate Account' button." `
    -ExpectedResult "Account deactivated INSTANTLY with NO confirmation. Logged out and redirected to login page."

# Test 4: Firestore Check
Show-Test `
    -TestName "Firestore Deactivation Status" `
    -Instructions "Open Firebase Console → Firestore → users collection. Find your user document." `
    -ExpectedResult "Should see accountStatus: 'deactivated' and deactivatedAt: <timestamp>"

# Test 5: Reactivation
Show-Test `
    -TestName "Account Reactivation on Login" `
    -Instructions "Login again with the same account (should be within 30 days)." `
    -ExpectedResult "Login successful, account automatically reactivated, proceed to dashboard normally."

# Test 6: Firestore Reactivation Check
Show-Test `
    -TestName "Firestore Reactivation Status" `
    -Instructions "Check Firestore again for your user document." `
    -ExpectedResult "Should see accountStatus: 'active', deactivatedAt: null, reactivatedAt: <timestamp>"

# Test 7: No Delete Button
Show-Test `
    -TestName "Delete Button Removed" `
    -Instructions "Go to Settings → Account Management. Look for any 'Delete Account' button." `
    -ExpectedResult "NO delete account button should be visible anywhere."

# Test 8: Console Logs
Show-Test `
    -TestName "Browser Console Logs" `
    -Instructions "Open browser DevTools (F12). Deactivate account and login again. Check console logs." `
    -ExpectedResult "Should see logs about: deactivation, reactivation, account status checks. No errors."

# Optional: Test 9 - Auto-Delete (Requires Manual Firestore Edit)
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "OPTIONAL TEST: Auto-Delete After 30 Days" -ForegroundColor Magenta
Write-Host ""
Write-Host "⚠️ This test requires manual Firestore modification" -ForegroundColor Yellow
Write-Host ""
$runAutoDelete = Read-Host "Do you want to test auto-deletion? (y/n)"

if ($runAutoDelete -eq "y") {
    Write-Host ""
    Write-Host "📋 Manual Setup Required:" -ForegroundColor Cyan
    Write-Host "   1. Deactivate your test account" -ForegroundColor White
    Write-Host "   2. Open Firestore Console" -ForegroundColor White
    Write-Host "   3. Find your user document" -ForegroundColor White
    Write-Host "   4. Edit 'deactivatedAt' field" -ForegroundColor White
    Write-Host "   5. Set date to 31+ days ago" -ForegroundColor White
    Write-Host "   6. Save the document" -ForegroundColor White
    Write-Host "   7. Try to login" -ForegroundColor White
    Write-Host ""
    
    Show-Test `
        -TestName "Auto-Delete After 30 Days" `
        -Instructions "After setting deactivatedAt to 31+ days ago, try to login with that account." `
        -ExpectedResult "Login should FAIL with error message: 'Your account was deactivated for more than 30 days and has been permanently deleted.'"
    
    Show-Test `
        -TestName "Account Deleted from Systems" `
        -Instructions "Check Firestore, Firebase Auth, and Storage for the deleted account." `
        -ExpectedResult "User document deleted from Firestore, account removed from Auth, profile photos deleted from Storage."
}

# Test Summary
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Tests Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed! Account management is working correctly." -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Please review the failures and fix issues." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common Issues:" -ForegroundColor Cyan
    Write-Host "  - Browser cache: Clear cache and hard reload (Ctrl+Shift+R)" -ForegroundColor White
    Write-Host "  - Firebase config: Check firebase.js configuration" -ForegroundColor White
    Write-Host "  - Firestore rules: Ensure users can update their own documents" -ForegroundColor White
    Write-Host "  - Console errors: Check browser DevTools console for errors" -ForegroundColor White
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. If tests passed: Deploy to production" -ForegroundColor White
Write-Host "2. Deploy Firebase Functions: Run .\deploy-functions.ps1" -ForegroundColor White
Write-Host "3. Monitor function logs: firebase functions:log" -ForegroundColor White
Write-Host "4. Document any issues in GitHub" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
