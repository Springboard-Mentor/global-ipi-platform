# DATABASE SETUP AND VIEWING GUIDE

## ✅ Current Status

Your backend is now properly configured to:
1. **Automatically save user registrations** to the database
2. **Automatically save patents from external API** to local database
3. **Search local database first**, then external API if not found
4. **No hardcoded sample data** - only real data is stored

---

## 📊 How to View Your Database Data

### Method 1: Interactive PowerShell Script (Recommended)
```powershell
cd "C:\Users\vikas\OneDrive\Desktop\New folder (2)\global-ipi-platform\backend"
.\database-manager.ps1
```

Features:
- ✅ View all patents
- ✅ View all users
- ✅ Create test users
- ✅ Search patents (auto-saves to DB)
- ✅ No PostgreSQL tools required
- ✅ Interactive menu

### Method 2: Web Browser Interface
1. Make sure backend is running
2. Open: `C:\Users\vikas\OneDrive\Desktop\New folder (2)\global-ipi-platform\backend\test-api.html`
3. Visual dashboard shows all data

### Method 3: PowerShell Commands
```powershell
# View all patents
Invoke-RestMethod -Uri "http://localhost:8080/api/patents"

# View all users
Invoke-RestMethod -Uri "http://localhost:8080/api/users"

# Create a user
$body = @{email="user@test.com"; password="pass123"; firstName="John"; lastName="Doe"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/users" -Method Post -Body $body -ContentType "application/json"
```

### Method 4: PostgreSQL Direct Query (if psql is available)
```powershell
$env:PGPASSWORD="Postgres@123"
psql -U postgres -h localhost -d my_project_db -c "SELECT * FROM users;"
psql -U postgres -h localhost -d my_project_db -c "SELECT * FROM patents;"
```

---

## 🚀 How Data Gets Saved

### User Registration Flow:
1. User registers via frontend → POST `/api/users`
2. Backend automatically saves to `users` table
3. User data is immediately available in database
4. **No manual intervention needed**

### Patent Data Flow:
1. User searches for patents → POST `/api/patents/search`
2. Backend checks local database first
3. If not found, calls external SerpAPI
4. **Automatically saves API results to database**
5. Next search for same patent uses local data (faster)

---

## 🗑️ Clear Old Sample Data (Optional)

If you want to remove any old test data:

```powershell
# Using PowerShell with Invoke-RestMethod
$patents = Invoke-RestMethod -Uri "http://localhost:8080/api/patents"
$patents | ForEach-Object {
    if ($_.apiSource -like "*Sample*" -or $_.apiSource -like "*Local*") {
        # You can manually delete via database tools if needed
    }
}
```

Or restart with clean database:
```sql
DELETE FROM patents;  -- Clears all patents
-- Users will be preserved
```

---

## 📝 Testing the System

### Test User Registration:
```powershell
# Create a test user
$user = @{
    email = "testuser@example.com"
    password = "secure123"
    firstName = "Test"
    lastName = "User"
    organization = "Test Corp"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/users" -Method Post -Body $user -ContentType "application/json"

# Verify it's saved
Invoke-RestMethod -Uri "http://localhost:8080/api/users"
```

### Test Patent Search and Save:
```powershell
# Search for patents (will auto-save to DB)
$search = @{ query = "artificial intelligence" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/patents/search" -Method Post -Body $search -ContentType "application/json"

# Verify they're in database
Invoke-RestMethod -Uri "http://localhost:8080/api/patents"
```

---

## 🔧 Backend Configuration

**Database**: PostgreSQL  
**Host**: localhost:5432  
**Database Name**: my_project_db  
**Username**: postgres  
**Password**: Postgres@123  

**Tables**:
- `users` - Stores user accounts
- `patents` - Stores patent/IP data

---

## 🎯 Key Changes Made:

1. ✅ Removed all hardcoded sample patent data
2. ✅ Service now only returns real database data or external API data
3. ✅ Patents from external API are automatically saved to local database
4. ✅ Search checks local database first (faster, no API calls)
5. ✅ User registration already saves to database automatically
6. ✅ No manual data insertion needed

---

## 💡 Usage Tips:

- **First search**: Fetches from external API and saves to DB
- **Subsequent searches**: Uses local database (instant results)
- **User registration**: Immediately stored in database
- **View anytime**: Use any of the methods above to see current data
- **No sample data**: Only real user registrations and API searches are stored

Your database is now working as a proper caching layer! 🎉
