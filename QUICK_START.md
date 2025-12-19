# 🚀 Quick Start Guide - Global IPI Platform

## Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- npm or yarn

---

## 🏃 Quick Start (5 Steps)

### Step 1: Start the Backend Server
```bash
cd backend/backend
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
**Backend will start on:** http://localhost:8080

**Wait for:** `Started BackendApplication in X seconds`

---

### Step 2: Start the Frontend
```bash
cd frontend/dashboard
npm run dev
```
**Frontend will start on:** http://localhost:5173

---

### Step 3: Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

### Step 4: Choose Your Search Mode

On the Dashboard, you'll see two search mode options:

**🌐 API Search**
- Fetches fresh data from external API
- Automatically saves to local database
- Best for: Getting new patent data

**💾 Local Database**
- Searches from stored patents
- Fast, offline-capable
- Best for: Quick searches, offline use

Click on your preferred mode!

---

### Step 5: Start Searching

1. **Enter a search query** in the header search bar
   - Example: "patent/US11734097B1/en"
   - Or any patent-related term

2. **Click Search** or press Enter

3. **View Results** with:
   - Patent ID
   - Title
   - Filing Date
   - Abstract

4. **Apply Filters** (optional):
   - Click "Show Filters"
   - Filter by text or date range

5. **View Details**:
   - Click "View More Details" on any patent

---

## 📊 Key Features Quick Access

### Search History
- Click **"View History"** button on search results page
- See all your previous searches
- Reload any past search with one click

### Filter Results
- Click **"Show Filters"** on search results page
- Enter text to search within results
- Set date range (From/To)
- Click "Reset Filters" to clear

### Search Counter
- Visible on search results page
- Tracks total searches performed
- Persists across browser sessions

### Local Database
- Check stored patents count on Dashboard
- Access via DevTools > Application > localStorage > `patentDatabase`
- Automatically populated from API searches

---

## 🔧 Useful Commands

### Rebuild Backend
```bash
cd backend/backend
mvn clean package -DskipTests
```

### Rebuild Frontend
```bash
cd frontend/dashboard
npm run build
```

### Clean Project
```bash
# Backend
cd backend/backend
mvn clean

# Frontend  
cd frontend/dashboard
rm -rf node_modules dist
npm install
```

---

## 🗂️ Where to Find Your Data

All data is stored in browser localStorage:

1. **Open Browser DevTools** (F12)
2. **Go to Application tab**
3. **Click on Local Storage** > http://localhost:5173
4. **Find these keys**:
   - `patentDatabase` - All stored patents
   - `searchHistory` - Last 10 searches
   - `searchCounter` - Total search count
   - `searchMode` - Current mode (api/local)
   - `userProfile` - User information

---

## ⚡ Tips & Tricks

### Switch Search Modes
- Use **API mode** when you need fresh data
- Use **Local mode** for faster searches from cached data
- Toggle anytime from the Dashboard

### Efficient Filtering
1. First, do a broad search
2. Then use filters to narrow down results
3. Filters work on already-loaded results (instant!)

### Search History
- Load any previous search instantly
- No need to re-type queries
- See when each search was performed

### Keyboard Shortcuts
- **Enter** in search bar = Submit search
- **Esc** can close modals (if implemented)

---

## 🐛 Troubleshooting

### Backend Won't Start
- Check if port 8080 is already in use
- Kill process: `netstat -ano | findstr :8080` then `taskkill /PID <pid> /F`
- Verify Java version: `java -version` (should be 17+)

### Frontend Won't Start
- Check if port 5173 is already in use
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### No Search Results
- Check backend is running (http://localhost:8080)
- Check browser console for errors (F12)
- Try switching to "API Search" mode
- Verify internet connection (for API mode)

### Filters Not Working
- Ensure you have search results loaded first
- Try resetting filters
- Check date format is correct

---

## 📱 Browser Compatibility

✅ Chrome (Recommended)  
✅ Firefox  
✅ Edge  
✅ Safari 14+  

---

## 🎯 Quick Feature Test

Test all features in 2 minutes:

1. ✅ **Start servers** (backend + frontend)
2. ✅ **Open app** in browser
3. ✅ **Toggle search mode** on Dashboard
4. ✅ **Search for** "test-patent"
5. ✅ **Apply a filter** on results
6. ✅ **View details** of a patent
7. ✅ **Check history** button
8. ✅ **Switch to Local mode**
9. ✅ **Search again** (should be faster!)
10. ✅ **Verify data** in localStorage (F12)

---

## 🎉 You're All Set!

Your Global IPI Platform is ready to use with:
- ✅ Dual search modes (API + Local)
- ✅ Advanced filtering
- ✅ Search history
- ✅ Local database storage
- ✅ Beautiful, responsive UI
- ✅ Real-time search counter

**Happy Searching!** 🔍📚
