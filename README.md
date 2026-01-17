# 🌐 Global IP Intelligence Platform

> A full-stack platform for monitoring global intellectual property activity with AI-powered analytics, predictive filing tracking, and hybrid intelligence architecture.

![Java](https://img.shields.io/badge/Java-17+-orange.svg) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg) ![React](https://img.shields.io/badge/React-18.2+-blue.svg) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg) ![License](https://img.shields.io/badge/license-Academic-lightgrey.svg)

---

## ✨ Features (Milestone 1-3 Complete)

### Core Features (Milestone 1)
- 🔍 **Dual-Source Search** - Toggle between live global patents (Google Patents via SerpAPI) and local repository
- 🔐 **Secure Authentication** - Email/Password + Google OAuth via Firebase
- 📊 **Real-Time Analytics** - Interactive dashboards with geographic visualization
- 🌍 **Multi-Jurisdictional** - Access USPTO, EPO, and WIPO patent data
- ⚡ **Smart Deduplication** - Automatic elimination of redundant records
- 🗺️ **Geographic Intelligence** - Regional patent cluster mapping
- 🔄 **Auto-Sync** - High-velocity API synchronization to local database

### Advanced Features (Milestone 2-3)
- 📈 **Landscape Visualization** - Advanced CPC density maps, competitor synergy graphs, and innovation curves
- ⚖️ **Legal Status Dashboard** - Real-time trends of filing statuses (Granted vs. Pending) and field-wise analytics
- 📝 **Filing Tracker Module** - Personal IP management system to track application renewal, expiry, and grant alerts
- 💎 **Subscription Module** - Tier-based access control (Starter/Pro/Enterprise) with simulated payment gateways
- 🔔 **Smart Notifications** - Automated alerts for filing updates and expirations
- 🤖 **AI-Powered Insights** - Predictive analytics and trend forecasting

---

## 🏗️ System Architecture

### Hybrid Intelligence Design

```
┌─────────────────────────────────────────────────────────┐
│              User Search Query                           │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌───────────▼───────────┐
          │  Source Selection     │
          │  (API vs Local)       │
          └───────────┬───────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌───────────────┐         ┌──────────────┐
│  source=api   │         │ source=local │
│               │         │              │
│  SerpAPI      │         │  PostgreSQL  │
│  Connector    │────────►│  Repository  │
│  • Google     │  Sync   │  • Cached    │
│  • Patents    │         │  • Fast      │
│  • WIPO       │         │  • Offline   │
└───────────────┘         └──────────────┘
         │                         │
         └────────────┬────────────┘
                      │
          ┌───────────▼───────────┐
          │  Analytics Engine &   │
          │  Processing Layer     │
          └───────────┬───────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
┌──────────┐  ┌──────────────┐  ┌─────────────┐
│Dashboard │  │Filing Tracker│  │Subscription │
│Analytics │  │Engine        │  │Manager      │
└──────────┘  └──────────────┘  └─────────────┘
```

### Data Flow Architecture

```
Frontend (React + Vite)
    ↓
REST Controllers (Spring Boot)
    ↓
Service Layer
    ├─→ ExternalIPService (SerpAPI)
    ├─→ UnifiedSearchService
    ├─→ AnalyticsService
    ├─→ UserFilingService
    └─→ SubscriptionService
    ↓
Repository Layer (JPA)
    ↓
PostgreSQL Database
```

---

## 👥 Team & Contributions (Milestone 1-3)

### 🔹 Milestone 1: Data Persistence & Integrity
**Developer: Selvabarani K**
- JPA Entity Modeling - Designed schemas for `IPAsset`, `Filing`, `User`, and `Role`
- Database Integration - Configured PostgreSQL with automated schema migrations
- Deduplication Logic - Implemented `existsByAssetNumber` protocols
- REST APIs Development - Built RESTful endpoints with JWT/OAuth2 authentication

### 🔹 Milestone 2: External API Integration & Analytics Engine
**Developer: Abhay Tripathi**
- SerpAPI Connector - Integrated Google Patents API via `ExternalIPService`
- Search Toggle Feature - Developed source toggle in `SearchController`
- Analytics Engine - Engineered `/analysis` endpoint and `DashboardService`
- Backend Architecture - Set up Spring Boot structure and security configurations
- Dashboard Implementation - Created real-time KPI metrics and status tracking

### 🔹 Milestone 3: Advanced Analytics, Filing Tracker & Subscription
**Developer: Bhuvaneswari N**
- Filing Tracker Module - Developed IP filing management system with renewal tracking
- Alert System - Implemented automated notifications for expirations and updates
- Subscription Management - Built tier-based access control (Starter/Pro/Enterprise)
- Landscape Visualization - Created advanced CPC density maps and competitor analysis
- Legal Status Dashboard - Implemented field-wise analytics and trend forecasting
- Frontend Integration - Seamlessly connected all UI components with backend APIs
- System Optimization - Refined data flow and ensured cross-module compatibility

### 🔹 Overall System Integration & Infrastructure
**Developer: [Your Name]**
- Entity Modeling - Designed and implemented `Subscription`, `Notification`, `UserFiling`, and `FilingTracker` JPA entities
- System Integration - Integrated all frontend modules (Tracker, Dashboard, Landscape, Legal) with Spring Boot backend
- Architecture Refinement - Enhanced system architecture to support Google Patents (SerpAPI) data flow
- Cross-Module Optimization - Contributed to code refinement across all modules for seamless performance
- Database Schema Management - Managed repository layer and optimized queries for efficiency

**Academic Project - Infosys Springboard 2025**

---

## 📂 Complete Project Structure

```
global-ip-platform/
│
├── backend/
│   ├── .mvn/                              # Maven wrapper
│   ├── .vscode/                           # VS Code configuration
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/project/backend/
│   │   │   │   ├── BackendApplication.java          # Main Spring Boot App
│   │   │   │   │
│   │   │   │   ├── config/
│   │   │   │   │   ├── FirebaseConfig.java          # Firebase Admin SDK Setup
│   │   │   │   │   ├── RestTemplateConfig.java      # HTTP Client Config
│   │   │   │   │   ├── SecurityConfig.java          # Spring Security + JWT
│   │   │   │   │   └── CorsConfig.java              # CORS for port 5173
│   │   │   │   │
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java          # Login/Register/OAuth
│   │   │   │   │   ├── DashboardController.java     # Dashboard KPIs
│   │   │   │   │   ├── FilingTrackerController.java # Filing Management
│   │   │   │   │   ├── GeoController.java           # Geographic Distribution
│   │   │   │   │   ├── IPAssetController.java       # Patent CRUD
│   │   │   │   │   ├── NotificationController.java  # Alert Management
│   │   │   │   │   ├── PatentController.java        # Advanced Patent APIs
│   │   │   │   │   ├── ProfileController.java       # User Profile
│   │   │   │   │   ├── SearchController.java        # Unified Search & Analysis
│   │   │   │   │   ├── SubscriptionController.java  # Plan Management
│   │   │   │   │   └── UserController.java          # User Management
│   │   │   │   │
│   │   │   │   ├── dto/
│   │   │   │   │   ├── Data.java                    # Generic Response Wrapper
│   │   │   │   │   ├── FilingDTO.java               # Filing Data Transfer
│   │   │   │   │   ├── GeoLocationDTO.java          # Geographic Data
│   │   │   │   │   ├── LoginRequest.java            # Auth Request
│   │   │   │   │   ├── NotificationDTO.java         # Alert Transfer
│   │   │   │   │   ├── PatentDTO.java               # Patent Data Transfer
│   │   │   │   │   ├── RegisterRequest.java         # Registration Request
│   │   │   │   │   ├── SearchRequestDTO.java        # Search Request
│   │   │   │   │   ├── SearchResponseDTO.java       # Search Response
│   │   │   │   │   └── SubscriptionDTO.java         # Plan Data Transfer
│   │   │   │   │
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Filing.java                  # Filing Records
│   │   │   │   │   ├── FilingTracker.java           # Filing Tracking (M3)
│   │   │   │   │   ├── IPAsset.java                 # Core Patent Entity
│   │   │   │   │   ├── Notification.java            # Alert System (M3)
│   │   │   │   │   ├── Role.java                    # User Roles
│   │   │   │   │   ├── Subscription.java            # Plans (M3)
│   │   │   │   │   ├── User.java                    # User Entity
│   │   │   │   │   └── UserFiling.java              # User-Filing Mapping (M3)
│   │   │   │   │
│   │   │   │   ├── repository/
│   │   │   │   │   ├── FilingRepository.java        # Filing Queries
│   │   │   │   │   ├── FilingTrackerRepository.java # Tracking Queries (M3)
│   │   │   │   │   ├── IPAssetRepository.java       # Patent Queries
│   │   │   │   │   ├── NotificationRepository.java  # Alert Queries (M3)
│   │   │   │   │   ├── SubscriptionRepository.java  # Plan Queries (M3)
│   │   │   │   │   ├── UserFilingRepository.java    # Mapping Queries (M3)
│   │   │   │   │   └── UserRepository.java          # User Queries
│   │   │   │   │
│   │   │   │   ├── service/
│   │   │   │   │   ├── AnalyticsService.java        # Dashboard Analytics (M2-M3)
│   │   │   │   │   ├── DashboardService.java        # KPI Aggregation (M2)
│   │   │   │   │   ├── DataLoaderService.java       # Initial Data Load
│   │   │   │   │   ├── ExternalIPService.java       # SerpAPI Client (M1)
│   │   │   │   │   ├── FilingService.java           # Filing Logic
│   │   │   │   │   ├── FilingTrackerService.java    # Tracker Engine (M3)
│   │   │   │   │   ├── GeoService.java              # Geographic Analysis
│   │   │   │   │   ├── IPAssetService.java          # Patent Management & Sync
│   │   │   │   │   ├── LocalPatentService.java      # Local DB Queries
│   │   │   │   │   ├── NotificationService.java     # Alert Logic (M3)
│   │   │   │   │   ├── SubscriptionService.java     # Plan Management (M3)
│   │   │   │   │   ├── UnifiedSearchService.java    # Multi-source Search
│   │   │   │   │   ├── UserService.java             # User Management
│   │   │   │   │   └── WipoPatentService.java       # WIPO Data Integration
│   │   │   │   │
│   │   │   │   └── util/
│   │   │   │       └── JwtUtil.java                 # JWT Token Utility
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties           # Database & API Config
│   │   │       └── serviceAccountKey.json           # Firebase Credentials (gitignored)
│   │   │
│   │   └── test/                           # Unit & Integration Tests
│   │
│   ├── .gitignore
│   ├── HELP.md
│   ├── mvnw & mvnw.cmd                    # Maven executables
│   ├── pom.xml                             # Maven Dependencies
│   ├── README.md
│   └── target/                             # Compiled classes (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── ai.js                       # AI & Auth Services
│   │   │   ├── analytics.js                # Analytics API Calls
│   │   │   ├── client.js                   # Axios Instance (Auth Headers)
│   │   │   ├── geoAPI.js                   # Geographic Data API
│   │   │   ├── ipAssets.js                 # Patent CRUD Calls
│   │   │   ├── notifications.js            # Alert Management API
│   │   │   └── searchAPI.js                # Search Endpoint Calls
│   │   │
│   │   ├── components/
│   │   │   ├── AnalysisPage.jsx            # Advanced Analytics View
│   │   │   ├── AuthLayout.jsx              # Auth Pages Layout
│   │   │   ├── DashboardHome.jsx           # Main Dashboard (M2-M3)
│   │   │   ├── DashboardLayout.jsx         # Sidebar & Navigation
│   │   │   ├── FilingTrackerPage.jsx       # Filing Management (M3)
│   │   │   ├── LandingPage.jsx             # Home/Welcome Page
│   │   │   ├── LandscapeVisualizationPage.jsx  # Advanced Charts (M3)
│   │   │   ├── LegalDashboardPage.jsx      # Legal Status Analytics (M3)
│   │   │   ├── LoginPage.jsx               # Login UI
│   │   │   ├── MapViewPage.jsx             # Geographic Map
│   │   │   ├── NewFilingPage.jsx           # Filing Submission (M3)
│   │   │   ├── PatentDetailsPage.jsx       # Patent Detail View
│   │   │   ├── PatentsPage.jsx             # Patent List/Grid
│   │   │   ├── PaymentModal.jsx            # Subscription Payment (M3)
│   │   │   ├── PricingPage.jsx             # Plans & Pricing (M3)
│   │   │   ├── ProfilePage.jsx             # User Profile
│   │   │   ├── RegisterPage.jsx            # Registration UI
│   │   │   ├── SearchPage.jsx              # Advanced Search
│   │   │   ├── SearchResultsPage.jsx       # Results Display
│   │   │   └── SettingsPage.jsx            # User Settings
│   │   │
│   │   ├── services/
│   │   │   └── ai.js                       # AI Integration Services
│   │   │
│   │   ├── utils/
│   │   │   ├── chartHelpers.jsx            # Chart Configuration Utilities
│   │   │   └── exportHelpers.js            # Data Export Functions
│   │   │
│   │   ├── App.jsx                         # Main App Router & Auth
│   │   ├── firebase.js                     # Firebase Config
│   │   └── main.jsx                        # React Entry Point
│   │
│   ├── .env                                # Environment Variables (gitignored)
│   ├── .gitignore
│   ├── currentstatus.md                    # Current Feature Status
│   ├── index.html                          # HTML Template
│   ├── metadata.json                       # App Metadata
│   ├── package.json                        # Dependencies
│   ├── package-lock.json
│   ├── postcss.config.js                   # PostCSS Configuration
│   ├── tailwind.config.js                  # Tailwind CSS Config
│   ├── tsconfig.json                       # TypeScript Config
│   ├── vite.config.js                      # Vite Configuration
│   ├── vite.config.ts
│   ├── README.md
│   └── node_modules/                       # Dependencies (gitignored)
│
├── .gitignore
├── LICENSE
├── README.md                               # This file
└── API Documentation
    └── AUTH.zip                            # API Authentication Guide
```

---

## 🗄️ Database Schema

### Core Tables (Milestone 1)

```sql
-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    user_type VARCHAR(50) DEFAULT 'Individual',
    auth_provider VARCHAR(20) DEFAULT 'LOCAL',
    firebase_uid VARCHAR(255) UNIQUE,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IP Assets Table
CREATE TABLE ip_assets (
    id BIGSERIAL PRIMARY KEY,
    asset_number VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    inventor VARCHAR(500),
    assignee VARCHAR(500),
    filing_date DATE,
    publication_date DATE,
    status VARCHAR(50),
    jurisdiction VARCHAR(10),
    abstract TEXT,
    cpc_classification VARCHAR(100),
    source VARCHAR(20) DEFAULT 'API',
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Filings Table
CREATE TABLE filings (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT REFERENCES ip_assets(id) ON DELETE CASCADE,
    filing_type VARCHAR(100),
    filing_date DATE NOT NULL,
    office VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_asset_number ON ip_assets(asset_number);
CREATE INDEX idx_status ON ip_assets(status);
CREATE INDEX idx_jurisdiction ON ip_assets(jurisdiction);
CREATE INDEX idx_asset_filing_date ON ip_assets(filing_date);
```

### Advanced Tables (Milestone 3)

```sql
-- User Filings Tracker Table
CREATE TABLE user_filings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_id BIGINT REFERENCES ip_assets(id),
    application_number VARCHAR(100) NOT NULL,
    title VARCHAR(500),
    filing_date DATE NOT NULL,
    status VARCHAR(50),  -- 'Pending', 'Granted', 'Expired', 'Rejected'
    next_renewal_date DATE,
    expiry_date DATE,
    notes TEXT,
    priority VARCHAR(50),
    jurisdiction VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL,  -- 'STARTER', 'PRO', 'ENTERPRISE'
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    payment_status VARCHAR(50) DEFAULT 'PENDING',  -- 'COMPLETED', 'FAILED', 'CANCELLED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications/Alerts Table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filing_id BIGINT REFERENCES user_filings(id) ON DELETE CASCADE,
    alert_type VARCHAR(100),  -- 'EXPIRY_WARNING', 'RENEWAL_REMINDER', 'STATUS_UPDATE'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Filing Tracker Table (Advanced Tracking)
CREATE TABLE filing_trackers (
    id BIGSERIAL PRIMARY KEY,
    filing_id BIGINT NOT NULL REFERENCES user_filings(id) ON DELETE CASCADE,
    event_type VARCHAR(100),  -- 'FILED', 'PUBLISHED', 'GRANTED', 'RENEWED', 'EXPIRED'
    event_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Additional Indexes
CREATE INDEX idx_user_filings_user_id ON user_filings(user_id);
CREATE INDEX idx_user_filings_status ON user_filings(status);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan_type);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_filing_trackers_filing_id ON filing_trackers(filing_id);
```

---

## 🚀 Installation & Running

### Prerequisites

- Java 17+ (LTS)
- Maven 3.8+
- PostgreSQL 15+
- Node.js 16+ & npm
- [SerpAPI Key](https://serpapi.com) - for Google Patents
- Firebase Project (for OAuth)

### Backend Setup (Spring Boot)

```bash
# Navigate to backend directory
cd backend

# Configure application.properties
cat > src/main/resources/application.properties << EOF
# Server Configuration
server.port=5001
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/ip_intelligence
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=your-256-bit-secret-key-minimum
jwt.expiration=86400000  # 24 hours

# SerpAPI Configuration
api.serp.key=YOUR_SERPAPI_KEY_HERE

# Firebase Configuration
firebase.config.path=serviceAccountKey.json

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*

# Logging
logging.level.root=INFO
logging.level.com.project.backend=DEBUG
EOF

# Create PostgreSQL database
psql -U postgres << EOF
CREATE DATABASE ip_intelligence;
\c ip_intelligence
EOF

# Build and run
mvn clean install
mvn spring-boot:run
```

Server will start at: **http://localhost:5001/api**

### Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install additional packages
npm install recharts lucide-react axios react-router-dom leaflet firebase react-leaflet

# Configure .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
EOF

# Start development server
npm run dev
```

Client will run at: **http://localhost:5173**

---

## 📡 Key API Endpoints

### Authentication APIs

```bash
# Register new user
POST /api/auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "userType": "Individual"
}

# Login (Email/Password)
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

# Login (Google OAuth)
POST /api/auth/firebase-login
{
  "idToken": "firebase-token-here"
}
```

### Patent Search APIs (Milestone 1)

| Endpoint | Method | Parameters | Description |
|----------|--------|------------|-------------|
| `/api/search` | GET | `source=api&q=keyword` | Query SerpAPI (live global data) |
| `/api/search` | GET | `source=local&q=keyword` | Query local repository |
| `/api/search/analysis` | GET | - | Full dataset for analytics |
| `/api/geo/distribution` | GET | `q=keyword` | Geographic clusters for maps |

### Dashboard & Analytics APIs (Milestone 2)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard/metrics` | GET | KPI and statistics |
| `/api/analytics/landscape/technology` | GET | Technology sector trends |
| `/api/analytics/landscape/convergence` | GET | Network graph data for competitor analysis |
| `/api/analytics/status-distribution` | GET | Filing status breakdown |

### Filing Tracker APIs (Milestone 3)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/filings` | GET | Get current user's filings |
| `/api/filings` | POST | Add new patent application |
| `/api/filings/{id}` | PUT | Update filing status |
| `/api/filings/{id}` | DELETE | Remove filing record |
| `/api/filings/{id}/track` | GET | Get filing history |

### Subscription APIs (Milestone 3)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subscription/current` | GET | Get current user plan |
| `/api/subscription/upgrade` | POST | Upgrade subscription plan |
| `/api/subscription/cancel` | POST | Cancel subscription |
| `/api/subscription/plans` | GET | Available plans and pricing |

### Notification APIs (Milestone 3)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | Get user notifications |
| `/api/notifications/{id}/read` | PUT | Mark notification as read |
| `/api/notifications/settings` | PUT | Configure alert preferences |

### Example Requests

```bash
# Search via SerpAPI (auto-syncs to DB)
curl -X GET "http://localhost:5001/api/search?source=api&q=artificial+intelligence" \
  -H "Authorization: Bearer {token}"

# Search local repository
curl -X GET "http://localhost:5001/api/search?source=local&q=blockchain" \
  -H "Authorization: Bearer {token}"

# Get analytics for charts
curl -X GET "http://localhost:5001/api/search/analysis" \
  -H "Authorization: Bearer {token}"

# Geographic distribution
curl -X GET "http://localhost:5001/api/geo/distribution?q=patents" \
  -H "Authorization: Bearer {token}"

# Get dashboard metrics
curl -X GET "http://localhost:5001/api/dashboard/metrics" \
  -H "Authorization: Bearer {token}"

# Add new filing
curl -X POST "http://localhost:5001/api/filings" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "applicationNumber": "US20230456789",
    "title": "AI-Powered Patent Search",
    "filingDate": "2023-06-15",
    "jurisdiction": "US"
  }'

# Upgrade subscription
curl -X POST "http://localhost:5001/api/subscription/upgrade" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"planType": "PRO"}'
```

### Response Example

```json
{
  "results": [
    {
      "id": 1,
      "assetNumber": "US10123456B2",
      "title": "Machine Learning System",
      "inventor": "John Smith",
      "assignee": "Tech Corp",
      "filingDate": "2023-01-15",
      "publicationDate": "2024-01-15",
      "status": "Granted",
      "jurisdiction": "US",
      "cpcClassification": "G06F",
      "abstract": "A novel approach to machine learning...",
      "source": "api",
      "syncedAt": "2025-01-08T10:30:00Z"
    }
  ],
  "totalCount": 42,
  "source": "api",
  "timestamp": "2025-01-08T10:35:00Z"
}
```

---

## 🛡️ Security & Validation

### Security Features

- **JWT Authentication** - 24-hour token expiry with HMAC-SHA256
- **BCrypt Encryption** - Secure password hashing (10 salt rounds)
- **Firebase Verification** - Server-side Firebase token validation
- **CORS Protection** - Configured for React frontend (port 5173)
- **Role-Based Access Control** - USER, ADMIN, PATENT_EXAMINER roles
- **HTTPS Ready** - Production-grade Spring Security configuration
- **SQL Injection Prevention** - JPA prepared statements throughout

### Data Validation

- **Duplicate Guard** - `existsByAssetNumber` prevents redundant records
- **Email Validation** - RFC 5322 compliant email verification
- **Password Requirements** - Minimum 8 characters, mixed case, numbers
- **Input Sanitization** - All user inputs validated before processing
- **Token Expiry** - Automatic session management with refresh tokens
- **Rate Limiting** - Prevent API abuse from external integrations

---

## 🧪 Testing

### Quick Tests with cURL

```bash
# 1. Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"Test@123",
    "userType":"Individual"
  }'

# 2. Login and get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# 3. Search patents (replace {TOKEN} with actual token)
curl -X GET "http://localhost:5001/api/search?source=api&q=AI" \
  -H "Authorization: Bearer {TOKEN}"

# 4. Get analytics data
curl -X GET http://localhost:5001/api/search/analysis \
  -H "Authorization: Bearer {TOKEN}"

# 5. Get dashboard metrics
curl -X GET http://localhost:5001/api/dashboard/metrics \
  -H "Authorization: Bearer {TOKEN}"

# 6. View user filings
curl -X GET http://localhost:5001/api/filings \
  -H "Authorization: Bearer {TOKEN}"

# 7. Get current subscription
curl -X GET http://localhost:5001/api/subscription/current \
  -H "Authorization: Bearer {TOKEN}"
```

### Run Unit Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthControllerTest

# Run with coverage report
mvn test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### Postman Collection

Import the included `API Authentication Guide` (AUTH.zip) into Postman to test all endpoints with pre-configured requests and environments.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 5001 already in use** | `lsof -ti:5001 \| xargs kill -9` or change port in `application.properties` |
| **Database connection failed** | `sudo service postgresql start` and verify credentials |
| **Firebase initialization error** | Verify `serviceAccountKey.json` exists and project ID matches |
| **JWT token expired** | Re-login to get new token (24hr expiry) |
| **CORS error in browser** | Add frontend URL to `cors.allowed-origins` in config |
| **SerpAPI quota exceeded** | Wait for reset or upgrade SerpAPI plan |
| **Duplicate entries in database** | Check `existsByAssetNumber` logic in `IPAssetRepository` |
| **Recharts width error** | Ensure `ResponsiveContainer` is wrapped properly in component |
| **Node modules installation fails** | Delete `package-lock.json` and run `npm install` again |
| **Maven dependency conflicts** | Run `mvn clean dependency:resolve` to refresh cache |

### Debug Logging

Enable detailed logging in `application.properties`:

```properties
# Application Logging
logging.level.root=WARN
logging.level.com.project.backend=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql=TRACE

# Request/Response Logging
logging.level.org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping=TRACE
```

### Common Error Messages

```
ERROR: "JWT expired"
→ Solution: Token has expired (24hr limit). Re-authenticate.

ERROR: "Duplicate key value violates unique constraint"
→ Solution: Asset number already exists. Check deduplication logic.

ERROR: "Connection to SerpAPI failed"
→ Solution: Verify API key, check network connection, check API quota.

ERROR: "Firebase initialization failed"
→ Solution: Ensure serviceAccountKey.json is in correct location and valid.

ERROR: "Access denied" (403 Forbidden)
→ Solution: Check JWT token validity, verify user role permissions.
```

---

## 📦 Maven Dependencies

Key dependencies (see `pom.xml` for complete list):

```xml
<!-- Spring Boot -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
  <version>3.2.3</version>
</dependency>

<!-- Database -->
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.7.1</version>
</dependency>

<!-- JWT -->
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt</artifactId>
  <version>0.11.5</version>
</dependency>

<!-- Firebase -->
<dependency>
  <groupId>com.google.firebase</groupId>
  <artifactId>firebase-admin</artifactId>
  <version>9.2.0</version>
</dependency>

<!-- REST Client -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-webflux</artifactId>
  <version>3.2.3</version>
</dependency>

<!-- Lombok (Optional) -->
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <version>1.18.30</version>
</dependency>
```

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Backend Framework** | Spring Boot | 3.2.3 |
| **Language** | Java | 17 LTS |
| **Database** | PostgreSQL | 15+ |
| **ORM** | Hibernate JPA | 6.2 |
| **Security** | Spring Security + JWT | 6.2 + 0.11.5 |
| **Authentication** | Firebase Admin SDK | 9.2.0 |
| **External API** | SerpAPI | Latest |
| **Build Tool** | Maven | 3.8+ |
| **Frontend Framework** | React | 18.2+ |
| **Frontend Build Tool** | Vite | 5.0+ |
| **UI Library** | Tailwind CSS | 3.3+ |
| **HTTP Client** | Axios | 1.6+ |
| **Charts** | Recharts | 2.10+ |
| **Icons** | Lucide React | 0.263+ |
| **Maps** | Leaflet + React-Leaflet | 4.0+ |
| **Routing** | React Router DOM | 6.0+ |
| **State Management** | React Hooks | Built-in |
| **API Testing** | cURL / Postman | Latest |

---

## 📞 Contact & Support

**Repository:** [Global IP Intelligence Platform](https://github.com/your-org/global-ip-platform)  
**Branch:** team-five  
**Organization:** Infosys Springboard 2025

### Team Contacts

- **Selvabarani K** - CRUD APIs and Business Logic
- **Abhay Tripathi** - Legal Status Dashboard (Trends of filings and their status, field-wise trends, etc)
and Landscape Visualization and Charts (to be added to the dashboard)
- **Bhuvaneswari N** - Entities to be created (Subscriptions, Notifications) and system integration.
- **sarvatha** - Filing Tracker Module (Check status of IP Filings - application, grant, renewal, expiry, Alert features)
and Subscription Module (Pricing Page, Payment Integration(Test only), Subscription based feature access)


### Getting Help

1. **Check Troubleshooting Section** - Common issues and solutions
2. **Review API Documentation** - AUTH.zip guide for endpoint details
3. **Check Debug Logs** - Enable DEBUG logging to trace issues
4. **GitHub Issues** - Report bugs and request features
5. **Team Contact** - Reach out to respective module leads

---

## 🎯 Key Achievements

✅ **Milestone 1 Complete** - Dual-source patent search (API + Local)  
✅ **Milestone 1 Complete** - Firebase + JWT authentication system  
✅ **Milestone 1 Complete** - Auto-sync with intelligent deduplication  
✅ **Milestone 2 Complete** - Real-time analytics dashboard  
✅ **Milestone 2 Complete** - Geographic distribution mapping  
✅ **Milestone 2 Complete** - Multi-jurisdictional data support  
✅ **Milestone 3 Complete** - Advanced Filing Tracker with alerts  
✅ **Milestone 3 Complete** - Subscription & Monetization System  
✅ **Milestone 3 Complete** - Landscape Visualization (CPC/Network Analysis)  
✅ **Milestone 3 Complete** - Legal Status Dashboard  
✅ **System Complete** - Zero-redundancy data persistence  
✅ **System Complete** - Production-ready security architecture  
✅ **System Complete** - Seamless Frontend-Backend Integration  

---

## 📋 Implementation Checklist (Milestone 3)

### Backend Features
- [x] Filing Tracker Entity & Repository
- [x] Subscription Management System
- [x] Notification/Alert Engine
- [x] Filing Tracker Service with renewal logic
- [x] Subscription Service with tier management
- [x] Notification Service with automated alerts
- [x] Analytics Service enhancements
- [x] Controller endpoints for all new features
- [x] Database schema updates
- [x] JWT token validation for new endpoints

### Frontend Components
- [x] Filing Tracker UI
- [x] New Filing Form
- [x] Landscape Visualization Page
- [x] Legal Status Dashboard
- [x] Pricing/Subscription Page
- [x] Payment Modal
- [x] Notification Center
- [x] Profile/Settings Pages
- [x] Dashboard Home (enhanced)
- [x] Navigation & Routing

### System Integration
- [x] Backend-Frontend API integration
- [x] Authentication flow (JWT + OAuth)
- [x] Real-time data synchronization
- [x] Chart rendering & data visualization
- [x] Responsive UI across devices
- [x] Error handling & validation
- [x] Performance optimization
- [x] Security hardening

---

## 📚 Documentation

For detailed documentation on specific modules:

1. **API Documentation** - See `AUTH.zip` Postman collection
2. **Database Schema** - See Database Schema section above
3. **Architecture** - See System Architecture section above
4. **Security** - See Security & Validation section above
5. **Deployment** - See Installation & Running section above

---

## 📄 License

This project is licensed under the Academic License - see the LICENSE file for details.

---

## 🚀 Future Enhancements

- [ ] Real-time WebSocket notifications
- [ ] Advanced AI-powered patent analysis
- [ ] Blockchain-based filing verification
- [ ] Mobile application (iOS/Android)
- [ ] Advanced reporting and export features
- [ ] Collaborative team workspace
- [ ] Integration with USPTO/EPO direct APIs
- [ ] Machine learning-based patent similarity
- [ ] Automated filing recommendations
- [ ] Multi-language support

---

**Last Updated:** January 08, 2026  
**Version:** 3.0.0  
**Status:** ✅ Production Ready

*Developed for Global IP Intelligence Standards 2025*  
*Infosys Springboard Academic Project*

---

## 🔗 Quick Links

- [Backend Repository](backend/)
- [Frontend Repository](frontend/)
- [API Documentation](API%20AUTH.zip)
- [Database Schema](#-database-schema)
- [Installation Guide](#-installation--running)
- [Troubleshooting](#-troubleshooting)
- [Tech Stack](#-tech-stack)