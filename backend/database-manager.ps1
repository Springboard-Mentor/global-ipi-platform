# PowerShell script to view and manage database via REST API
# This script doesn't require PostgreSQL client tools

$API_BASE = "http://localhost:8080/api"

function Show-Banner {
    Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     DATABASE VIEWER - Global IPI Platform                ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
}

function Test-BackendConnection {
    try {
    $response = Invoke-RestMethod -Uri "$API_BASE/patents" -Method Get -ErrorAction Stop
    Write-Host "`n✔ All systems are operational." -ForegroundColor Green
    return $true
} catch {
    Write-Host "`n✖ We’re unable to connect to the service at the moment." -ForegroundColor Red
    Write-Host "Our team is working to restore access. Please try again shortly." -ForegroundColor Yellow
    return $false
}
}

function Show-Patents {
    Write-Host "`n╔═══ 📄 PATENTS DATA ═══╗" -ForegroundColor Green
    try {
        $patents = Invoke-RestMethod -Uri "$API_BASE/patents" -Method Get
        
        if ($patents.Count -eq 0) {
            Write-Host "No patents found in database." -ForegroundColor Yellow
            Write-Host "Patents will be automatically saved when you search via the API." -ForegroundColor Cyan
        } else {
            Write-Host "Total Patents: $($patents.Count)" -ForegroundColor Yellow
            Write-Host "`nPatent Details:" -ForegroundColor White
            $patents | Format-Table -Property @{
                Label="DB ID"; Expression={$_.patentId}
            }, @{
                Label="Patent ID"; Expression={$_.id}
            }, @{
                Label="Title"; Expression={
                    if ($_.title.Length -gt 50) { $_.title.Substring(0, 47) + "..." }
                    else { $_.title }
                }
            }, @{
                Label="Assignee"; Expression={
                    if ($_.assignee.Length -gt 20) { $_.assignee.Substring(0, 17) + "..." }
                    else { $_.assignee }
                }
            }, @{
                Label="Status"; Expression={$_.status}
            }, @{
                Label="Source"; Expression={$_.apiSource}
            } -AutoSize
        }
    } catch {
        Write-Host "Error fetching patents: $_" -ForegroundColor Red
    }
}

function Show-Users {
    Write-Host "`n╔═══ 👥 USERS DATA ═══╗" -ForegroundColor Green
    try {
        $users = Invoke-RestMethod -Uri "$API_BASE/users" -Method Get
        
        if ($users.Count -eq 0) {
            Write-Host "No users found in database." -ForegroundColor Yellow
            Write-Host "Create users via POST to /api/users endpoint." -ForegroundColor Cyan
        } else {
            Write-Host "Total Users: $($users.Count)" -ForegroundColor Yellow
            Write-Host "`nUser Details:" -ForegroundColor White
            $users | Format-Table -Property @{
                Label="ID"; Expression={$_.id}
            }, @{
                Label="Email"; Expression={$_.email}
            }, @{
                Label="First Name"; Expression={$_.firstName}
            }, @{
                Label="Last Name"; Expression={$_.lastName}
            }, @{
                Label="Organization"; Expression={$_.organization}
            }, @{
                Label="Verified"; Expression={
                    if ($_.isVerified) { "✓" } else { "✗" }
                }
            }, @{
                Label="Active"; Expression={
                    if ($_.isActive) { "✓" } else { "✗" }
                }
            } -AutoSize
        }
    } catch {
        Write-Host "Error fetching users: $_" -ForegroundColor Red
    }
}

function Create-SampleUser {
    Write-Host "`n╔═══ Creating Sample User ═══╗" -ForegroundColor Magenta
    
    $email = Read-Host "Enter email (or press Enter for test@example.com)"
    if ([string]::IsNullOrWhiteSpace($email)) {
        $email = "test@example.com"
    }
    
    $password = Read-Host "Enter password (or press Enter for 'password123')"
    if ([string]::IsNullOrWhiteSpace($password)) {
        $password = "password123"
    }
    
    $firstName = Read-Host "Enter first name (or press Enter for 'Test')"
    if ([string]::IsNullOrWhiteSpace($firstName)) {
        $firstName = "Test"
    }
    
    $lastName = Read-Host "Enter last name (or press Enter for 'User')"
    if ([string]::IsNullOrWhiteSpace($lastName)) {
        $lastName = "User"
    }
    
    $body = @{
        email = $email
        password = $password
        firstName = $firstName
        lastName = $lastName
        organization = "Test Organization"
    } | ConvertTo-Json
    
    try {
        $newUser = Invoke-RestMethod -Uri "$API_BASE/users" -Method Post -Body $body -ContentType "application/json"
        Write-Host "`n✓ User created successfully!" -ForegroundColor Green
        Write-Host "User ID: $($newUser.id)" -ForegroundColor Cyan
        Write-Host "Email: $($newUser.email)" -ForegroundColor Cyan
    } catch {
        Write-Host "`n✗ Error creating user: $_" -ForegroundColor Red
    }
}

function Search-Patents {
    Write-Host "`n╔═══ Search Patents (via API) ═══╗" -ForegroundColor Magenta
    
    $query = Read-Host "Enter search term (e.g., 'machine learning', 'AI', 'solar panel')"
    
    if ([string]::IsNullOrWhiteSpace($query)) {
        Write-Host "Search term cannot be empty" -ForegroundColor Red
        return
    }
    
    $body = @{ query = $query } | ConvertTo-Json
    
    try {
        Write-Host "`nSearching for '$query'..." -ForegroundColor Yellow
        $results = Invoke-RestMethod -Uri "$API_BASE/patents/search" -Method Post -Body $body -ContentType "application/json"
        
        Write-Host "`nFound $($results.Count) patent(s)" -ForegroundColor Green
        Write-Host "(These have been automatically saved to the database)" -ForegroundColor Cyan
        
        if ($results.Count -gt 0) {
            $results | Format-Table -Property id, title, assignee, status, apiSource -AutoSize
        }
    } catch {
        Write-Host "`n✗ Error searching patents: $_" -ForegroundColor Red
    }
}

function Show-Menu {
    Write-Host "`n╔═══ MENU ═══╗" -ForegroundColor Cyan
    Write-Host "1. View All Patents" -ForegroundColor White
    Write-Host "2. View All Users" -ForegroundColor White
    Write-Host "3. Create Sample User" -ForegroundColor White
    Write-Host "4. Search Patents (saves to DB automatically)" -ForegroundColor White
    Write-Host "5. Refresh All Data" -ForegroundColor White
    Write-Host "6. Exit" -ForegroundColor White
    Write-Host ""
}

# Main script
Show-Banner

if (-not (Test-BackendConnection)) {
    Write-Host "`nExiting..." -ForegroundColor Red
    exit 1
}

while ($true) {
    Show-Menu
    $choice = Read-Host "Select an option (1-6)"
    
    switch ($choice) {
        "1" { Show-Patents }
        "2" { Show-Users }
        "3" { Create-SampleUser }
        "4" { Search-Patents }
        "5" { 
            Show-Patents
            Show-Users
        }
        "6" { 
            Write-Host "`nGoodbye!" -ForegroundColor Cyan
            exit 0
        }
        default { Write-Host "Invalid choice. Please select 1-6." -ForegroundColor Red }
    }
    
    Write-Host "`nPress any key to continue..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
