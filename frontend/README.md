# Global IP Intelligence Platform – Frontend

A **production-ready React frontend application** for the **Global IP Intelligence Platform**, built using **React 18 + Vite**, integrated with **Firebase Authentication (Google OAuth)**, a **JWT-secured Spring Boot backend**, **Geographic Map Visualization**, and **AI-powered patent analysis**.

---

## 📌 Project Information

* **Project Name:** Global IP Intelligence Platform
* **Module:** Frontend
* **Framework:** React 18
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Map Library:** Leaflet + React-Leaflet
* **Authentication:** Firebase (Google OAuth)
* **Authorization:** JWT (Backend generated)
* **Backend:** Spring Boot (Port `5001`)
* **Last Updated:** December 25, 2025
* **Project Type:** Academic – Infosys Springboard
* **Status:** ✅ Complete & Production Ready

---

## 👥 Frontend Team Members

| Name               | Responsibility                                   |
| ------------------ | ------------------------------------------------ |
| **Abhay Tripathi** | Frontend–Backend Auth Flow, Firebase Integration, Search System, Map Integration |
| **Sarvatha R**     | UI Pages & Layout Structure, Component Design    |
| **Aarthi**         | Dashboard, Profile & Patent UI, User Experience  |

---

## 🎯 Project Deliverables

### ✅ Deliverable 1: Search Form Page/Section

**Implementation:** `SearchPage.jsx` and Filter Panel in `SearchResultsPage.jsx`

#### Features Implemented:
* **Multi-Parameter Search Interface:**
  - ✅ Keyword search (patent titles, abstracts, inventors)
  - ✅ Assignee/Owner search
  - ✅ Inventor name search
  - ✅ Jurisdiction filtering (US, EP, CN, IN, JP, KR, GB, DE, FR)
  - ✅ Status filtering (Active, Pending, Expired, Abandoned)
  - ✅ Date range filtering (From/To dates)
  - ✅ IP Type selection (Patent/Trademark/Both)

* **User Experience:**
  - Real-time search with debouncing (600ms delay)
  - Clear visual feedback for active filters
  - Filter badges showing selected options
  - One-click filter clearing
  - Responsive collapsible sidebar
  - Mobile-friendly filter interface

* **Source Selection:**
  - Toggle between Local Database and External API
  - Visual indicators for data source
  - Seamless switching without page reload

---

### ✅ Deliverable 2: Search List Page

**Implementation:** `SearchResultsPage.jsx`

#### Features Implemented:

##### 🔍 Search Results Display
* **Triple View Modes:** 🆕
  - ✅ List View (detailed card layout)
  - ✅ Grid View (compact card layout)
  - ✅ **Map View (geographic visualization)** 🗺️
  - Smooth transitions between views

* **Result Cards Include:**
  - Patent/Trademark type badge
  - Title with hover effects
  - Status badge (color-coded)
  - Jurisdiction with flag emoji
  - Patent/Registration number
  - Filing date
  - Inventors list
  - IPC/Asset classification code
  - Abstract preview (2-line clamp)
  - Source indicator (Local/API)
  - Track button for monitoring
  - View Details button

##### 🎛️ Filter & Sort Functionality
* **Advanced Filtering:**
  - Real-time filter application
  - Multiple simultaneous filters
  - Jurisdiction multi-select
  - Status multi-select
  - Date range picker
  - Asset type radio selection
  - Filter count indicators

* **Sorting Options:**
  - Sort by Filing Date (Newest First)
  - Sort by Filing Date (Oldest First)
  - Sort by Title (A-Z)
  - Dropdown selector for easy access

##### 📄 Pagination System
* **Robust Pagination:**
  - ✅ Customizable results per page (10/20/50)
  - ✅ Smart page number display (shows 5 pages max)
  - ✅ Previous/Next navigation buttons
  - ✅ Current page highlighting
  - ✅ Total results counter
  - ✅ Disabled state for edge pages

##### 💾 Session Persistence
* **State Management:**
  - Saves search state to sessionStorage
  - Restores filters on browser back
  - Maintains pagination position
  - Preserves sort preferences
  - Tracks user selections

##### 📊 Export Functionality
* **CSV Export:**
  - ✅ Export all search results to CSV
  - Includes: Title, ID, Status, Jurisdiction, Inventors, Assignee, Filing Date, Abstract, Source
  - Proper CSV formatting with quote escaping
  - Date-stamped filename
  - Handles empty results gracefully

##### 🎨 Visual Features
* **Modern UI/UX:**
  - Color-coded status badges
  - Jurisdiction flag emojis
  - Smooth hover animations
  - Loading spinners
  - Empty state illustrations
  - Responsive grid layouts
  - Shadow effects on hover
  - Border color transitions

---

### ✅ Deliverable 3: IP Details Page

**Implementation:** `PatentDetailsPage.jsx`

#### Features Implemented:

##### 📋 Comprehensive Information Display
* **Core Patent/Trademark Details:**
  - ✅ Full title display
  - ✅ Patent/Registration number
  - ✅ Status with color coding
  - ✅ Jurisdiction with flag
  - ✅ IP Type (Patent/Trademark)
  - ✅ Complete abstract text
  - ✅ IPC/CPC classification codes

##### 👤 Ownership Information
* **Owner/Assignee Details:**
  - ✅ Primary assignee name
  - ✅ Assignee organization
  - ✅ Contact information (if available)
  - ✅ Visual owner card layout

* **Inventor Information:**
  - ✅ Complete inventor names list
  - ✅ Inventor affiliations
  - ✅ Multiple inventor handling
  - ✅ Formatted display with icons

##### ⚖️ Legal & Administrative Information
* **Issuing Authority:**
  - ✅ Authority name (USPTO, EPO, WIPO, etc.)
  - ✅ Authority jurisdiction
  - ✅ Official links (if available)

* **Coverage & Duration:**
  - ✅ Geographic area of coverage
  - ✅ Filing date
  - ✅ Grant/Registration date
  - ✅ Expiration date
  - ✅ Duration calculation
  - ✅ Validity period display
  - ✅ Time remaining indicator

##### 📊 Visual Information Layout
* **Structured Sections:**
  - Header with key metadata
  - Timeline visualization
  - Tabbed interface for detailed info
  - Document preview area
  - Related patents section
  - Action buttons (Track, Export, Share)

##### 🎯 Interactive Features
* **User Actions:**
  - Track/Untrack patent
  - Export details as PDF
  - Copy patent number
  - Share patent link
  - View similar patents
  - Generate AI analysis

---

## 🗺️ NEW FEATURE: Geographic Map View (Bonus Deliverable)

**Implementation:** `MapViewPage.jsx` with Leaflet Integration

### Features Implemented:

#### 📍 Interactive Map Visualization
* **Global Patent Distribution:**
  - ✅ World map with OpenStreetMap tiles
  - ✅ Marker clustering for dense regions
  - ✅ Custom colored markers by patent count
  - ✅ Jurisdiction-based marker placement
  - ✅ Interactive zoom and pan controls
  - ✅ Responsive map layout

#### 🎨 Visual Elements
* **Smart Marker System:**
  - Color-coded markers by volume:
    - 🔴 Red: 100+ patents
    - 🟠 Orange: 50-99 patents
    - 🟢 Green: 20-49 patents
    - 🔵 Blue: <20 patents
  - Marker count badges
  - Smooth clustering animation
  - Click-to-expand functionality

#### 📊 Sidebar Statistics
* **Real-time Analytics:**
  - ✅ Jurisdiction breakdown
  - ✅ Patent vs Trademark counts
  - ✅ Active vs Pending status
  - ✅ Flag emoji indicators
  - ✅ Click to focus on jurisdiction
  - ✅ Collapsible sidebar

#### 🔍 Interactive Popups
* **Marker Click Details:**
  - Jurisdiction name and flag
  - Total patent count
  - Trademark count
  - Active asset count
  - Pending asset count
  - "View Details" button

#### 🎛️ Map Controls
* **Customization Options:**
  - Multiple map styles (Standard/Light)
  - Toggle sidebar visibility
  - Back to list navigation
  - Filter synchronization

#### 🔄 Filter Integration
* **Seamless Data Sync:**
  - Map respects all active filters
  - Real-time update on filter change
  - Source toggle support (Local/API)
  - Search keyword integration

### Geographic Mapping

**Supported Jurisdictions:**
```javascript
US  🇺🇸 - United States (37.0902°N, 95.7129°W)
EP  🇪🇺 - European Union (50.8503°N, 4.3517°E)
CN  🇨🇳 - China (35.8617°N, 104.1954°E)
IN  🇮🇳 - India (20.5937°N, 78.9629°E)
JP  🇯🇵 - Japan (36.2048°N, 138.2529°E)
KR  🇰🇷 - South Korea (35.9078°N, 127.7669°E)
GB  🇬🇧 - United Kingdom (55.3781°N, 3.4360°W)
DE  🇩🇪 - Germany (51.1657°N, 10.4515°E)
FR  🇫🇷 - France (46.2276°N, 2.2137°E)
```

---

## 🏗️ Architecture & Technical Implementation

### 📁 Complete Frontend Structure

```
frontend/
│
├── src/
│   │
│   ├── api/
│   │   ├── client.js            # Axios instance + JWT interceptor
│   │   ├── ai.js                # AI service API calls
│   │   ├── searchAPI.js         # Unified search API integration
│   │   └── geoAPI.js            # 🆕 Geographic data API
│   │
│   ├── components/              # All application pages
│   │   │
│   │   ├── AuthLayout.jsx       # Public auth layout wrapper
│   │   ├── DashboardLayout.jsx  # Protected dashboard layout
│   │   │
│   │   ├── LandingPage.jsx      # Public landing page
│   │   ├── LoginPage.jsx        # Login & Google OAuth
│   │   ├── RegisterPage.jsx     # User registration
│   │   │
│   │   ├── DashboardHome.jsx    # Dashboard overview
│   │   ├── ProfilePage.jsx      # User profile management
│   │   ├── SettingsPage.jsx     # User settings
│   │   │
│   │   ├── SearchPage.jsx       # 📍 DELIVERABLE 1: Search Form
│   │   ├── SearchResultsPage.jsx # 📍 DELIVERABLE 2: Search List
│   │   ├── MapViewPage.jsx      # 🆕 BONUS: Map View
│   │   ├── PatentDetailsPage.jsx # 📍 DELIVERABLE 3: Details Page
│   │   │
│   │   ├── PatentsPage.jsx      # User's patent portfolio
│   │   ├── NewFilingPage.jsx    # New IP filing form
│   │   └── AnalysisPage.jsx     # AI patent analysis
│   │
│   ├── services/
│   │   └── ai.js                # Gemini AI service
│   │
│   ├── utils/
│   │   └── geoMapping.js        # 🆕 Jurisdiction coordinate mapping
│   │
│   ├── App.jsx                  # Route configuration
│   ├── firebase.js              # Firebase initialization
│   ├── index.jsx                # React entry point
│   └── index.css                # Global Tailwind styles
│
├── .env                         # Environment variables
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite build config
└── README.md                    # This file
```

---

## 🔌 API Integration

### Backend Endpoints Used

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| **Search (Local)** | `/api/patents/search` | GET | Search local database |
| **Search (API)** | `/api/patents/api-search` | GET | Search external APIs |
| **Patent Details** | `/api/patents/{id}` | GET | Get patent details |
| **User Patents** | `/api/patents/user` | GET | Get user's patents |
| **Track Patent** | `/api/patents/{id}/track` | POST | Track a patent |
| **New Filing** | `/api/filings/create` | POST | Create new filing |
| **Geo Distribution** | `/api/geo/distribution` | GET | 🆕 Get geographic data |
| **Geo Search** | `/api/geo/distribution/search` | GET | 🆕 Search geo data |
| **Auth Login** | `/api/auth/firebase-login` | POST | Firebase authentication |
| **Auth Register** | `/api/auth/register` | POST | User registration |
| **Profile** | `/api/profile` | GET/PUT | User profile management |

### Search API Parameters

```javascript
{
  keyword: string,           // Search term
  ipType: 'patent|trademark|both',
  source: 'local|api',      // Data source toggle
  jurisdictions: 'US,EP,CN', // Comma-separated
  statuses: 'ACTIVE,PENDING', // Comma-separated
  dateFrom: 'YYYY-MM-DD',
  dateTo: 'YYYY-MM-DD',
  page: number,             // Zero-indexed
  size: number,             // Results per page
  sortBy: 'filingDate|title',
  sortDirection: 'asc|desc'
}
```

### 🆕 Geographic API Parameters

```javascript
{
  ipType: 'patent|trademark|both',
  status: 'ACTIVE|PENDING',
  keyword: string  // Optional search term
}
```

**Response Format:**
```json
[
  {
    "jurisdiction": "US",
    "jurisdictionName": "United States",
    "patentCount": 150,
    "trademarkCount": 45,
    "activeCount": 120,
    "pendingCount": 30,
    "latitude": 37.0902,
    "longitude": -95.7129,
    "zoom": 4
  }
]
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: #4F46E5      /* Indigo - Actions, CTAs */
--secondary: #10B981    /* Emerald - Success, API */
--accent: #8B5CF6       /* Purple - Trademarks */

/* Status Colors */
--active: #10B981       /* Emerald - Active/Granted */
--pending: #F59E0B      /* Amber - Pending/Under Review */
--expired: #EF4444      /* Red - Expired/Rejected */

/* Map Marker Colors */
--marker-high: #EF4444   /* Red - 100+ patents */
--marker-med: #F59E0B    /* Orange - 50-99 patents */
--marker-low: #10B981    /* Green - 20-49 patents */
--marker-min: #6366F1    /* Blue - <20 patents */

/* Neutral */
--gray-50: #F9FAFB
--gray-900: #111827
```

### Typography

* **Font Family:** Inter (system fallback)
* **Headings:** Bold, Tight tracking
* **Body:** Regular, Relaxed leading
* **Mono:** SF Mono (for patent numbers)

### Components

* **Cards:** White background, subtle shadow, rounded-xl
* **Buttons:** Solid primary, outline secondary, ghost tertiary
* **Inputs:** Slate-50 background, border on focus
* **Badges:** Small, rounded-full, color-coded
* **Icons:** Lucide React, 16-20px standard size
* **Map Markers:** 🆕 Custom div icons with circular badges

---

## 🔐 Authentication Flow

### Google Sign-In Flow
```
1. User clicks "Sign in with Google"
2. Firebase signInWithPopup() triggered
3. Firebase ID Token generated
4. POST /api/auth/firebase-login with token
5. Backend verifies with Firebase Admin SDK
6. Backend returns JWT token
7. Frontend stores JWT in localStorage
8. Axios interceptor attaches JWT to all requests
```

### Email/Password Registration
```
1. User fills registration form
2. Frontend validates input
3. POST /api/auth/register
4. Backend creates user in PostgreSQL
5. Backend returns JWT token
6. Frontend stores JWT and redirects to dashboard
```

### Route Protection
```javascript
// All protected routes wrapped in DashboardLayout
<Route element={<DashboardLayout />}>
  <Route path="/dashboard" element={<DashboardHome />} />
  <Route path="/search" element={<SearchPage />} />
  <Route path="/search/results" element={<SearchResultsPage />} />
  <Route path="/patent/:id" element={<PatentDetailsPage />} />
  // ... other protected routes
</Route>
```

---

## 🚀 Installation & Setup

### Prerequisites
```bash
Node.js >= 18.x
npm or yarn
Backend running on http://localhost:5001
Firebase project configured
```

### Environment Configuration

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5001

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Installation Steps

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# 🆕 Install map-related dependencies
npm install leaflet react-leaflet react-leaflet-cluster

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access Application
```
Development: http://localhost:5173
Production Build: dist/ folder
```

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.0",
  "axios": "^1.7.2",
  "firebase": "^10.12.3",
  "lucide-react": "^0.424.0",
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "react-leaflet-cluster": "^1.2.0"
}
```

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^4.3.1",
  "tailwindcss": "^3.4.1",
  "autoprefixer": "^10.4.18",
  "postcss": "^8.4.35",
  "vite": "^5.3.1"
}
```

---

## 🧪 Testing Deliverables

### Test Scenarios for Deliverable 1 (Search Form)
- [x] Keyword search works
- [x] Multiple filter combinations
- [x] Date range validation
- [x] Source toggle functionality
- [x] Clear filters resets all
- [x] Filter persistence on navigation

### Test Scenarios for Deliverable 2 (Search Results)
- [x] Results load from both sources
- [x] Pagination navigation works
- [x] Sorting changes order correctly
- [x] View toggle (list/grid/map) functions 🆕
- [x] Export CSV downloads
- [x] Empty state displays
- [x] Loading state shows spinner
- [x] Track button toggles state
- [x] Map view displays correctly 🆕
- [x] Marker clustering works 🆕

### Test Scenarios for Deliverable 3 (Details Page)
- [x] All patent data displays
- [x] Owner information populates
- [x] Authority details show
- [x] Duration calculations correct
- [x] Related patents load
- [x] Actions work (track, export, share)

### 🆕 Test Scenarios for Map View (Bonus)
- [x] Map loads with correct center and zoom
- [x] Markers display for all jurisdictions
- [x] Marker colors match patent counts
- [x] Clustering works for dense areas
- [x] Popup shows on marker click
- [x] Sidebar statistics update correctly
- [x] Filter sync between list and map
- [x] Back button returns to list view
- [x] Map style toggle works

---

## 📱 Responsive Design

### Breakpoints
```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

### Mobile Optimizations
* Collapsible filter sidebar
* Stacked card layouts
* Touch-friendly buttons (44px min)
* Simplified navigation
* Horizontal scrolling for tables
* Bottom sheet modals
* 🆕 Mobile-optimized map controls
* 🆕 Collapsible map sidebar on mobile

---

## ⚡ Performance Optimizations

### Implemented Techniques
* **Debounced Search:** 600ms delay on keyword input
* **Lazy Loading:** Components loaded on demand
* **Session Caching:** Search results cached in sessionStorage
* **Pagination:** Limits API payload size
* **Optimized Images:** Flags use emoji (no image files)
* **Code Splitting:** Vite automatic chunking
* **Memoization:** React.memo on heavy components
* 🆕 **Map Clustering:** Reduces DOM nodes for 1000+ markers
* 🆕 **Tile Caching:** Leaflet caches map tiles
* 🆕 **Lazy Map Loading:** Map component loads only when needed

---

## 🔒 Security Considerations

### Frontend Security
* JWT stored in localStorage (with expiry check)
* Auto-logout on 401 responses
* XSS prevention via React's default escaping
* CSRF protection via JWT (no cookies)
* Input sanitization on all forms
* No sensitive data in localStorage
* HTTPS required in production

### API Communication
* All requests include JWT token
* Axios interceptor handles auth
* Error responses logged (not exposed to user)
* CORS configured on backend

---

## 🐛 Known Issues & Limitations

### Current Limitations
* No offline mode (requires backend connection)
* Real-time updates not available
* Limited to 50 results per page max
* Export limited to visible results
* 🆕 Map markers use approximate center coordinates for countries

### Browser Compatibility
* ✅ Chrome 90+
* ✅ Firefox 88+
* ✅ Safari 14+
* ✅ Edge 90+
* ⚠️ IE11 not supported

---

## 📊 Project Status

| Deliverable | Status | Completion |
|------------|--------|------------|
| Search Form Page | ✅ Complete | 100% |
| Search List Page | ✅ Complete | 100% |
| IP Details Page | ✅ Complete | 100% |
| **Map View Integration** | ✅ **Complete** | **100%** 🆕 |
| Authentication | ✅ Complete | 100% |
| Dashboard | ✅ Complete | 100% |
| Profile Management | ✅ Complete | 100% |
| AI Analysis | ✅ Complete | 100% |
| New Filing | ✅ Complete | 100% |
| Responsive Design | ✅ Complete | 100% |

---

## 📞 Support & Contact

### Team Contacts
* **Abhay Tripathi** - Lead Developer (Auth, Search, Integration, Map Feature)
* **Sarvatha R** - UI Developer (Pages, Layout)
* **Aarthi** - UX Developer (Dashboard, Profile)

### Resources
* Backend API Documentation: `/swagger-ui/index.html`
* Firebase Console: [firebase.google.com](https://firebase.google.com)
* Tailwind Docs: [tailwindcss.com](https://tailwindcss.com)
* Leaflet Docs: [leafletjs.com](https://leafletjs.com)

---

## 📄 License

**Academic Project** – Infosys Springboard  
For educational purposes only.

---

## 🏆 Achievements

* ✅ All 3 core deliverables completed on time
* ✅ **Bonus map visualization feature implemented** 🗺️
* ✅ Responsive mobile-first design
* ✅ Production-ready code quality
* ✅ Comprehensive error handling
* ✅ Modern UI/UX implementation
* ✅ Clean, maintainable codebase
* ✅ Proper documentation
* ✅ **Interactive geographic data visualization**
* ✅ **Real-time filter synchronization across views**

---

**Last Updated:** December 25, 2025  
**Version:** 2.0.0  
**Status:** ✅ PRODUCTION READY + MAP INTEGRATION COMPLETE

---

## 🙏 Acknowledgments

* **Infosys Springboard** for project guidance
* **Backend Team** for robust API implementation
* **Open Source Community** for excellent libraries
* **Government IP Offices** for public API access
* **Leaflet Community** for amazing mapping library

---

**Made with ❤️ by the Frontend Team**

---

## 📸 Feature Screenshots

### Map View Features
- 🗺️ **Interactive World Map** with patent distribution
- 📍 **Smart Marker Clustering** for dense regions
- 🎨 **Color-coded Markers** by patent volume
- 📊 **Real-time Statistics** sidebar
- 🔍 **Detailed Popups** on marker click
- 🎛️ **Multiple Map Styles** (Standard/Light)
- 🔄 **Seamless Filter Sync** with list view

---

## 🚀 Quick Start for Map Feature

```bash
# 1. Install dependencies
npm install leaflet react-leaflet react-leaflet-cluster

# 2. Import Leaflet CSS in index.css
@import 'leaflet/dist/leaflet.css';

# 3. Start development server
npm run dev

# 4. Navigate to search results and click Map View icon 🗺️
```

---

## 🎓 Technical Implementation Notes

### Map Architecture
- **Frontend-First Approach:** Coordinates mapped in `geoMapping.js`
- **Backend API Support:** Optional geo-aggregation endpoints
- **Efficient Rendering:** Marker clustering for 1000+ points
- **Mobile Responsive:** Touch-optimized controls
- **Filter Integration:** Real-time sync with search filters

### Data Flow
```
Search Filters → API Call → Results → Group by Jurisdiction → Map Markers
                                                             ↓
                                                  Clustering Algorithm
                                                             ↓
                                                  Render on Leaflet Map
```

---

**🎉 Project Complete with Advanced Geographic Visualization!**