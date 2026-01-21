# 🌐 Global IP Intelligence Platform

> A production-grade full-stack platform for monitoring global intellectual property activity with AI-powered analytics, hybrid intelligence architecture, enterprise administration, and real-time notification system.

![Java](https://img.shields.io/badge/Java-17+-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![License](https://img.shields.io/badge/license-Academic-lightgrey.svg)

**Infosys Springboard Internship Project 2025** | **Team Five** | **Mentor:** Springboardmentor111

---

## 📋 Table of Contents

- [Project Timeline](#-project-timeline-milestones-1-4)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Team Contributions](#-team--contributions)
- [Service Layer Architecture](#-service-layer-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Security & Validation](#-security--validation)
- [Advanced Features](#-advanced-features)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Tech Stack](#-tech-stack)
- [Future Roadmap](#-future-roadmap)

---

## 📅 Project Timeline: Milestones 1-4

### Milestone 1: Foundation & Core Infrastructure
**Duration:** Weeks 1-2 | **Focus:** Backend Foundation & Data Modeling

**Key Deliverables:**
- Database schema design and PostgreSQL setup
- Core entity modeling (User, IPAsset, Filing, Role)
- Spring Boot project initialization
- Basic authentication with JWT
- RESTful API foundation

**Team Focus:**
- **Selvabarani K:** JPA entity relationships, repository interfaces
- **Bhuvaneswari N:** Spring Boot configuration, controller setup
- **Abhay Tripathi:** Initial security configuration

---

### Milestone 2: External Integration & Search Engine
**Duration:** Weeks 3-4 | **Focus:** API Integration & Search Functionality

**Key Deliverables:**
- SerpAPI integration for live patent data (USPTO, EPO, WIPO)
- Dual-source search architecture (API vs Local)
- Smart deduplication engine
- Auto-sync mechanism for API data
- Geographic data processing

**Team Focus:**
- **Bhuvaneswari N:** ExternalIPService, UnifiedSearchService implementation
- **Selvabarani K:** IPAssetService with deduplication logic
- **Abhay Tripathi:** Firebase OAuth integration

**Services Introduced:**
- `ExternalIPService.java` - SerpAPI connector
- `UnifiedSearchService.java` - Multi-source coordinator
- `IPAssetService.java` - Asset management with deduplication
- `GeoService.java` - Geographic intelligence
- `WipoPatentService.java` - WIPO-specific data handling

---

### Milestone 3: Analytics & User Experience
**Duration:** Weeks 5-6 | **Focus:** Analytics Dashboard & User Management

**Key Deliverables:**
- Real-time analytics engine
- Interactive data visualization (charts, maps)
- User preference management
- Activity logging system
- Frontend-backend integration

**Team Focus:**
- **Bhuvaneswari N:** DashboardService, AnalyticsService
- **Selvabarani K:** CORS configuration, security headers
- **Abhay Tripathi:** User analytics, monitoring tools
- **Sarvatha R:** Initial admin features

**Services Introduced:**
- `DashboardService.java` - KPI metrics aggregation
- `AnalyticsService.java` - Advanced analytics processing
- `ActivityLoggerService.java` - User activity tracking
- `UIPreferenceService.java` - Theme and preference management
- `LocalPatentService.java` - Local database search optimization

---

### Milestone 4: Enterprise Features & Production Readiness
**Duration:** Weeks 7-8 | **Focus:** Admin Control & Subscription System

**Key Deliverables:**
- Comprehensive admin dashboard
- Multi-tier subscription engine
- Filing management system with feedback
- API health monitoring
- Notification system
- Production security hardening

**Team Focus:**
- **Sarvatha R:** User management, system health monitoring
- **Abhay Tripathi:** Admin analytics, API health dashboard
- **Selvabarani K:** Environment configuration, production setup
- **Bhuvaneswari N:** Subscription logic, filing tracker

**Services Introduced:**
- `SubscriptionService.java` - Multi-tier billing engine
- `UserManagementService.java` - Admin user operations
- `AdminMonitoringService.java` - System health tracking
- `FilingService.java` - Filing lifecycle management
- `FilingFeedbackService.java` - Admin feedback system
- `FilingTrackerService.java` - Status tracking and updates
- `NotificationService.java` - Real-time alerts
- `DataLoaderService.java` - Bulk data import
- `CustomUserDetailsService.java` - Spring Security integration

---

## ✨ Features

### Core Capabilities (Milestones 1-2)
- 🔍 **Dual-Source Intelligent Search** - Toggle between live global patents (SerpAPI) and local repository with sub-second response times
- 🔐 **Multi-Factor Authentication** - Email/Password + Google OAuth via Firebase with JWT token management
- 📊 **Real-Time Analytics Engine** - Interactive dashboards with geographic visualization and trend analysis
- 🌍 **Multi-Jurisdictional Coverage** - Access USPTO, EPO, and WIPO patent databases with unified interface
- ⚡ **Smart Deduplication** - Automatic elimination of redundant records using `existsByAssetNumber` protocol
- 🗺️ **Geographic Intelligence** - Regional patent cluster mapping with D3.js visualization
- 🔄 **High-Velocity Auto-Sync** - API synchronization to local database with configurable intervals

### Analytics & Monitoring (Milestone 3)
- 📈 **Advanced Analytics Dashboard** - KPI tracking, search patterns, and user engagement metrics
- 🎯 **Activity Logging** - Comprehensive user action tracking for audit trails
- 🎨 **Personalization Engine** - User preference management with theme customization
- 🔎 **Local Search Optimization** - High-performance local database queries with caching

### Enterprise Features (Milestone 4)
- 👨‍💼 **Admin Control Room** - Comprehensive user management, role promotion, and bulk operations
- 💳 **Subscription Engine** - Multi-tier pricing (Free/Pro/Enterprise) with dynamic billing
- 🎨 **Persistent Theming** - Dark/light mode with database synchronization
- 📈 **System Health Monitoring** - Real-time tracking of active sessions, uptime, and database status
- 🔔 **Notification System** - Real-time alerts for filing updates, subscription changes, and system events
- 📝 **Filing Management Suite** - Status tracking, feedback system, and timeline visualization
- 🔍 **API Health Dashboard** - Uptime and latency monitoring for external data providers
- 📊 **User Analytics** - DAU tracking, retention metrics, and geographic distribution
- 🔑 **Role-Based Access Control** - USER, ADMIN, PATENT_EXAMINER permission hierarchies

---

## 🏗️ System Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  React 18 + Tailwind CSS + Recharts + D3.js                 │
│  • User Dashboard  • Admin Console  • Analytics View        │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API (JSON)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Application Layer                          │
│              Spring Boot 3.2.3 + Java 17                     │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Service Layer (20 Services)          │       │
│  │  • UnifiedSearchService  • SubscriptionService   │       │
│  │  • AnalyticsService      • AdminMonitoringService│       │
│  │  • NotificationService   • FilingTrackerService  │       │
│  └──────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────┐       │
│  │           Security & Integration Layer            │       │
│  │  • JWT Auth  • Firebase OAuth  • CORS Config     │       │
│  └──────────────────────────────────────────────────┘       │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────────┐
│  Data Layer   │         │  External APIs   │
│               │         │                  │
│  PostgreSQL   │         │  • SerpAPI       │
│  15+          │◄────────│  • Google Patents│
│               │  Sync   │  • WIPO API      │
│  • Users      │         │  • USPTO         │
│  • IPAssets   │         │  • EPO           │
│  • Filings    │         │                  │
│  • Subs       │         │                  │
│  • Logs       │         │                  │
└───────────────┘         └──────────────────┘
```

### Hybrid Intelligence Search Flow

```
User Query
    │
    ▼
┌─────────────────┐
│ SearchController│
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│UnifiedSearchService  │
│ (Route Decision)     │
└────────┬─────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│source=  │ │ source=local │
│  api    │ │              │
│         │ │              │
│External │ │LocalPatent   │
│IPService│ │Service       │
│         │ │              │
│ SerpAPI │ │ PostgreSQL   │
│  Call   │ │  JPA Query   │
└────┬────┘ └──────┬───────┘
     │             │
     │    ┌────────┘
     │    │
     ▼    ▼
┌──────────────┐
│ IPAssetService│
│ (Deduplication│
│  & Sync)      │
└───────┬───────┘
        │
        ▼
┌──────────────┐
│ Return JSON  │
│ to Frontend  │
└──────────────┘
```

### Service Interaction Map

```
┌──────────────────────────────────────────────────┐
│              Controller Layer                     │
│  AuthController | SearchController | AdminController
└─────────────────────┬────────────────────────────┘
                      │
      ┌───────────────┼───────────────┐
      │               │               │
      ▼               ▼               ▼
┌──────────┐  ┌──────────────┐  ┌────────────┐
│UserService│  │UnifiedSearch │  │AdminMonitor│
│          │  │Service       │  │ingService  │
└─────┬────┘  └──────┬───────┘  └─────┬──────┘
      │              │                 │
      ├──────────────┼─────────────────┤
      │              │                 │
      ▼              ▼                 ▼
┌──────────────────────────────────────────┐
│         Supporting Services              │
│                                          │
│ • ActivityLoggerService (audit)         │
│ • AnalyticsService (metrics)            │
│ • NotificationService (alerts)          │
│ • SubscriptionService (billing)         │
│ • FilingTrackerService (status)         │
│ • UIPreferenceService (personalization) │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────┐
│ Repositories │
│ (JPA/Hibernate)
└──────────────┘
```

---

## 👥 Team & Contributions

### Complete Development Cycle (Milestones 1-4)

| Team Member | Modules Owned | Services Developed | Key Achievements |
|-------------|---------------|-------------------|------------------|
| **Selvabarani K** | Data Persistence, Backend Integration, Security | `IPAssetService`, `CustomUserDetailsService`, `DataLoaderService` | JPA entity modeling, PostgreSQL optimization, deduplication algorithms, CORS configuration, environment management, production security hardening |
| **Bhuvaneswari N** | External APIs, Analytics, Subscriptions | `ExternalIPService`, `UnifiedSearchService`, `DashboardService`, `AnalyticsService`, `SubscriptionService`, `WipoPatentService` | SerpAPI integration, dual-source architecture, analytics engine, subscription billing logic, pricing algorithms |
| **Abhay Tripathi** | Authentication, Monitoring, Admin Analytics | `AdminMonitoringService`, `NotificationService`, `ActivityLoggerService` | Firebase OAuth, JWT implementation, API health monitoring, user analytics, real-time notification system |
| **Sarvatha R** | Admin Infrastructure, User Management | `UserManagementService`, `FilingService`, `FilingFeedbackService`, `FilingTrackerService` | Admin control panel, user CRUD operations, role promotion, filing lifecycle management, feedback system |

### Cross-Functional Services (Collaborative)
- `GeoService.java` - Geographic intelligence (Selvabarani + Bhuvaneswari)
- `LocalPatentService.java` - Local search optimization (Selvabarani + Bhuvaneswari)
- `UIPreferenceService.java` - Personalization (Bhuvaneswari + Sarvatha)

---

## 🔧 Service Layer Architecture

### Complete Service Inventory (20 Services)

#### Core Business Logic Services

**1. UnifiedSearchService.java**
- Multi-source search coordination (API vs Local)
- Query optimization and caching
- Result aggregation and formatting
```java
public SearchResultDTO search(String source, String query) {
    return source.equals("api") 
        ? externalIPService.searchPatents(query)
        : localPatentService.searchLocal(query);
}
```

**2. IPAssetService.java**
- Asset lifecycle management
- Deduplication using `existsByAssetNumber`
- Auto-sync from external APIs
- Bulk operations support

**3. SubscriptionService.java**
- Multi-tier plan management (Basic/Pro/Enterprise)
- Dynamic billing calculation (monthly/yearly)
- Pro-rated upgrades/downgrades
- Renewal date computation
```java
@Transactional
public SubscriptionDTO upgradeSubscription(String uid, PlanType plan, BillingCycle cycle) {
    // Atomic upgrade with pro-rated billing
}
```

**4. FilingService.java**
- Filing record CRUD operations
- Status workflow management
- Filing-to-asset relationship handling
- Timeline generation

**5. UserService.java**
- User registration and authentication
- Profile management
- Password encryption (BCrypt)
- Firebase UID mapping

#### Analytics & Monitoring Services

**6. AnalyticsService.java**
- Search pattern analysis
- User engagement metrics
- Trend detection algorithms
- Data aggregation for charts

**7. DashboardService.java**
- KPI calculation (DAU, MAU, search volume)
- Real-time metric updates
- Geographic distribution processing
- Status-based filtering

**8. AdminMonitoringService.java**
- System health checks (uptime, memory)
- Active session tracking
- Database connection monitoring
- API response time tracking

**9. ActivityLoggerService.java**
- User action logging
- Audit trail generation
- Timestamp management
- Log retention policies

#### External Integration Services

**10. ExternalIPService.java**
- SerpAPI HTTP client
- USPTO/EPO/WIPO connector
- Response parsing and mapping
- Rate limiting and retry logic
```java
public List<PatentDTO> searchPatents(String query) {
    // SerpAPI call with error handling
}
```

**11. WipoPatentService.java**
- WIPO-specific data transformation
- International patent parsing
- PCT application handling
- Multi-language support

**12. GeoService.java**
- Geographic data extraction
- Coordinate mapping
- Regional clustering
- Heatmap data generation

#### User Experience Services

**13. UIPreferenceService.java**
- Theme persistence (dark/light mode)
- User settings management
- Preference synchronization
- Default configuration handling

**14. NotificationService.java**
- Real-time alert generation
- Email/in-app notifications
- Event-driven triggers
- Notification history

**15. LocalPatentService.java**
- High-performance local queries
- Full-text search optimization
- Result caching
- Pagination support

#### Administrative Services

**16. UserManagementService.java**
- Admin user CRUD operations
- Bulk user activation/deactivation
- Role assignment workflows
- User filtering and searching

**17. FilingTrackerService.java**
- Status change tracking
- Timeline event logging
- Deadline monitoring
- Progress visualization

**18. FilingFeedbackService.java**
- Admin feedback CRUD
- Rich text content storage
- Filing-feedback association
- Feedback history

#### Security & Data Services

**19. CustomUserDetailsService.java**
- Spring Security integration
- User authentication loading
- Role-based authority mapping
- Session management

**20. DataLoaderService.java**
- Bulk data import utilities
- CSV/Excel parsing
- Database seeding
- Migration support

### Service Dependencies

```
UserService ──► ActivityLoggerService
            ├──► NotificationService
            └──► CustomUserDetailsService

UnifiedSearchService ──► ExternalIPService
                    ├──► LocalPatentService
                    ├──► IPAssetService
                    └──► ActivityLoggerService

SubscriptionService ──► NotificationService
                   └──► ActivityLoggerService

AdminMonitoringService ──► AnalyticsService
                      ├──► UserService
                      └──► ExternalIPService

FilingService ──► FilingTrackerService
             ├──► FilingFeedbackService
             └──► NotificationService
```

---

## 📂 Project Structure

```text
global-ip-platform/
├── backend/
│   └── src/main/java/com/project/backend/
│       ├── config/
│       │   ├── FirebaseConfig.java          # Firebase Admin SDK setup
│       │   ├── SecurityConfig.java          # JWT + Spring Security
│       │   ├── CorsConfig.java              # Cross-origin configuration
│       │   └── AppConfig.java               # Bean definitions
│       ├── controller/
│       │   ├── AuthController.java          # Login, register, OAuth
│       │   ├── SearchController.java        # Search endpoints
│       │   ├── SubscriptionController.java  # Plan management
│       │   ├── AdminController.java         # Admin operations
│       │   ├── FilingController.java        # Filing management
│       │   ├── GeoController.java           # Geographic data
│       │   ├── DashboardController.java     # Analytics endpoints
│       │   ├── NotificationController.java  # Alert management
│       │   └── UserController.java          # User operations
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   ├── PatentDTO.java
│       │   ├── SubscriptionDTO.java
│       │   ├── FilingDTO.java
│       │   ├── AnalyticsDTO.java
│       │   ├── NotificationDTO.java
│       │   └── GeoLocationDTO.java
│       ├── entity/
│       │   ├── User.java                    # User entity
│       │   ├── IPAsset.java                 # Patent/IP entity
│       │   ├── Filing.java                  # Filing records
│       │   ├── Subscription.java            # Subscription plans
│       │   ├── ActivityLog.java             # User actions
│       │   ├── Notification.java            # Alerts
│       │   ├── UIPreference.java            # User settings
│       │   ├── FilingFeedback.java          # Admin feedback
│       │   └── Role.java                    # User roles
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── IPAssetRepository.java
│       │   ├── FilingRepository.java
│       │   ├── SubscriptionRepository.java
│       │   ├── ActivityLogRepository.java
│       │   ├── NotificationRepository.java
│       │   ├── UIPreferenceRepository.java
│       │   └── FilingFeedbackRepository.java
│       ├── service/                         # ★ 20 Service Classes ★
│       │   ├── ActivityLoggerService.java
│       │   ├── AdminMonitoringService.java
│       │   ├── AnalyticsService.java
│       │   ├── CustomUserDetailsService.java
│       │   ├── DashboardService.java
│       │   ├── DataLoaderService.java
│       │   ├── ExternalIPService.java
│       │   ├── FilingFeedbackService.java
│       │   ├── FilingService.java
│       │   ├── FilingTrackerService.java
│       │   ├── GeoService.java
│       │   ├── IPAssetService.java
│       │   ├── LocalPatentService.java
│       │   ├── NotificationService.java
│       │   ├── SubscriptionService.java
│       │   ├── UIPreferenceService.java
│       │   ├── UnifiedSearchService.java
│       │   ├── UserManagementService.java
│       │   ├── UserService.java
│       │   └── WipoPatentService.java
│       ├── util/
│       │   ├── JwtUtil.java                 # JWT operations
│       │   └── DateUtil.java                # Date calculations
│       └── exception/
│           ├── GlobalExceptionHandler.java
│           ├── ResourceNotFoundException.java
│           └── UnauthorizedException.java
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/                       # Admin dashboard
│       │   │   ├── UserManagement.jsx
│       │   │   ├── SystemHealth.jsx
│       │   │   ├── APIHealthMonitor.jsx
│       │   │   └── UserAnalytics.jsx
│       │   ├── subscription/
│       │   │   ├── PricingCard.jsx
│       │   │   └── SubscriptionManager.jsx
│       │   ├── filing/
│       │   │   ├── FilingTracker.jsx
│       │   │   └── FeedbackEditor.jsx
│       │   ├── analytics/
│       │   │   ├── DashboardCharts.jsx
│       │   │   └── GeoMap.jsx
│       │   └── common/
│       │       ├── Navbar.jsx
│       │       └── ThemeToggle.jsx
│       ├── services/
│       │   ├── api.js                       # Axios instance
│       │   ├── authService.js
│       │   ├── searchService.js
│       │   └── subscriptionService.js
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ThemeContext.jsx
│       └── App.jsx
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (LTS) - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.8+** - `brew install maven` or download from [Maven](https://maven.apache.org/)
- **Node.js 18+ & npm** - Download from [Node.js](https://nodejs.org/)
- **PostgreSQL 15+** - `brew install postgresql` or [PostgreSQL Downloads](https://www.postgresql.org/download/)
- **SerpAPI Key** - Register at [SerpAPI](https://serpapi.com)
- **Firebase Project** - Setup at [Firebase Console](https://console.firebase.google.com/)

### Backend Installation

```bash
# 1. Clone repository
git clone https://github.com/your-org/global-ip-platform.git
cd global-ip-platform/backend

# 2. Create database
psql -U postgres
CREATE DATABASE ip_intelligence;
\q

# 3. Configure application properties
cp src/main/resources/application.properties.template src/main/resources/application.properties

# Edit application.properties with your credentials
nano src/main/resources/application.properties
```

**application.properties Configuration:**
```properties
# Server
server.port=5001

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/ip_intelligence
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
jwt.secret=YOUR_256_BIT_SECRET_KEY_HERE
jwt.expiration=86400000

# SerpAPI
api.serp.key=YOUR_SERPAPI_KEY
api.serp.engine=google_patents

# CORS
cors.allowed-origins=http://localhost:5173,http://192.168.*.*

# Firebase
firebase.database-url=https://your-project.firebaseio.com
```

```bash
# 4. Add Firebase credentials
# Download serviceAccountKey.json from Firebase Console
# Place in src/main/resources/serviceAccountKey.json

# 5. Build and run
mvn clean install
mvn spring-boot:run
```

Backend starts at `http://localhost:5001` ✅

### Frontend Installation

```bash
cd ../frontend

# 1. Install dependencies
npm install

# 2. Configure environment variables
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
EOF

# 3. Start development server
npm run dev
```

Frontend starts at `http://localhost:5173` ✅

### Quick Verification

```bash
# Test backend health
curl http://localhost:5001/actuator/health

# Expected response: {"status":"UP"}
```

---

## 📡 API Endpoints

### Authentication Endpoints

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "userType": "Individual"
}

Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "john@example.com", "role": "USER" }
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 86400
}
```

```http
POST /api/auth/firebase-login
Content-Type: application/json

{
  "idToken": "firebase-id-token-from-oauth"
}
```

### Search & IP Intelligence Endpoints

| Endpoint | Method | Params | Service Used | Description |
|----------|--------|--------|--------------|-------------|
| `/api/search` | GET | `source=api&q=keyword` | `UnifiedSearchService` | Live API search (SerpAPI) |
| `/api/search` | GET | `source=local&q=keyword` | `LocalPatentService` | Local database search |
| `/api/search/analysis` | GET | - | `AnalyticsService` | Full dataset for charts |
| `/api/geo/distribution` | GET | `q=keyword` | `GeoService` | Geographic clusters |
| `/api/dashboard/metrics` | GET | - | `DashboardService` | KPI statistics |
| `/api/patents/{id}` | GET | - | `IPAssetService` | Single patent details |

### Subscription Endpoints

| Endpoint | Method | Service | Description |
|----------|--------|---------|-------------|
| `/api/subscription/pricing` | GET | `SubscriptionService` | Get all plan pricing |
| `/api/subscription/status/{uid}` | GET | `SubscriptionService` | Current user plan |
| `/api/subscription/upgrade` | POST | `SubscriptionService` | Change plan/billing cycle |
| `/api/subscription/cancel` | POST | `SubscriptionService` | Cancel subscription |
| `/api/subscription/history/{uid}` | GET | `SubscriptionService` | Billing history |

**Upgrade Example:**
```http
POST /api/subscription/upgrade
Authorization: Bearer {token}
Content-Type: application/json

{
  "uid": "user123",
  "planType": "IP_PROFESSIONAL",
  "billingCycle": "YEARLY"
}

Response: {
  "planType": "IP_PROFESSIONAL",
  "amount": 1910.00,
  "billingCycle": "YEARLY",
  "renewalDate": "2027-01-21",
  "discount": 20
}
```

### Admin Endpoints (Requires ADMIN role)

| Endpoint | Method | Service | Description |
|----------|--------|---------|-------------|
| `/api/admin/users` | GET | `UserManagementService` | List all users (paginated) |
| `/api/admin/users/{id}` | GET | `UserManagementService` | User details |
| `/api/admin/users/{id}/activate` | PUT | `UserManagementService` | Toggle active status |
| `/api/admin/users/{id}/role` | PUT | `UserManagementService` | Promote/demote role |
| `/api/admin/users` | DELETE | `UserManagementService` | Bulk delete |
| `/api/admin/health` | GET | `AdminMonitoringService` | System health metrics |
| `/api/admin/health/api` | GET | `AdminMonitoringService` | External API status |
| `/api/admin/analytics/dau` | GET | `AnalyticsService` | Daily Active Users |
| `/api/admin/analytics/retention` | GET | `AnalyticsService` | User retention rate |
| `/api/admin/analytics/search-trends` | GET | `AnalyticsService` | Popular searches |

### Filing Management Endpoints

| Endpoint | Method | Service | Description |
|----------|--------|---------|-------------|
| `/api/filings` | GET | `FilingService` | List user filings |
| `/api/filings` | POST | `FilingService` | Create new filing |
| `/api/filings/{id}` | GET | `FilingService` | Filing details |
| `/api/filings/{id}/status` | PUT | `FilingTrackerService` | Update status |
| `/api/filings/{id}/feedback` | POST | `FilingFeedbackService` | Add admin feedback |
| `/api/filings/{id}/timeline` | GET | `FilingTrackerService` | Status history |

### Notification Endpoints

| Endpoint | Method | Service | Description |
|----------|--------|---------|-------------|
| `/api/notifications` | GET | `NotificationService` | User notifications |
| `/api/notifications/{id}/read` | PUT | `NotificationService` | Mark as read |
| `/api/notifications/unread-count` | GET | `NotificationService` | Unread count |

### User Preference Endpoints

| Endpoint | Method | Service | Description |
|----------|--------|---------|-------------|
| `/api/preferences` | GET | `UIPreferenceService` | User settings |
| `/api/preferences/theme` | PUT | `UIPreferenceService` | Update theme |
| `/api/preferences` | PUT | `UIPreferenceService` | Update all settings |

---

## 🗄️ Database Schema

### Core Tables with Relationships

```sql
-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'Individual',
    auth_provider VARCHAR(20) DEFAULT 'LOCAL',
    firebase_uid VARCHAR(255) UNIQUE,
    role VARCHAR(20) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Subscriptions Table
-- ============================================
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL, -- INVENTOR_BASIC, IP_PROFESSIONAL, GLOBAL_ENTERPRISE
    billing_cycle VARCHAR(20) NOT NULL, -- MONTHLY, YEARLY
    amount DECIMAL(10,2) NOT NULL,
    discount_percent INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, CANCELLED, EXPIRED
    start_date DATE NOT NULL,
    renewal_date DATE NOT NULL,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- IP Assets Table
-- ============================================
CREATE TABLE ip_assets (
    id BIGSERIAL PRIMARY KEY,
    asset_number VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    inventor VARCHAR(500),
    assignee VARCHAR(500),
    filing_date DATE,
    publication_date DATE,
    grant_date DATE,
    status VARCHAR(50),
    jurisdiction VARCHAR(10),
    abstract TEXT,
    claims_count INT,
    source VARCHAR(20) DEFAULT 'API',
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Filings Table
-- ============================================
CREATE TABLE filings (
    id BIGSERIAL PRIMARY KEY,
    ip_asset_id BIGINT REFERENCES ip_assets(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    filing_type VARCHAR(100),
    filing_number VARCHAR(255) UNIQUE,
    filing_date DATE NOT NULL,
    office VARCHAR(50),
    status VARCHAR(50),
    current_stage VARCHAR(100),
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Filing Feedback Table
-- ============================================
CREATE TABLE filing_feedback (
    id BIGSERIAL PRIMARY KEY,
    filing_id BIGINT NOT NULL REFERENCES filings(id) ON DELETE CASCADE,
    admin_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    feedback_type VARCHAR(50), -- COMMENT, APPROVAL, REJECTION, REQUEST
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Activity Logs Table
-- ============================================
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- LOGIN, SEARCH, SUBSCRIBE, etc.
    resource_type VARCHAR(50), -- PATENT, FILING, USER
    resource_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Notifications Table
-- ============================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- INFO, SUCCESS, WARNING, ERROR
    category VARCHAR(50), -- FILING, SUBSCRIPTION, SYSTEM
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- UI Preferences Table
-- ============================================
CREATE TABLE ui_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'LIGHT', -- LIGHT, DARK
    language VARCHAR(10) DEFAULT 'en',
    dashboard_layout VARCHAR(50),
    notification_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_subscription_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscription_status ON subscriptions(status);
CREATE INDEX idx_subscription_renewal ON subscriptions(renewal_date);

CREATE INDEX idx_asset_number ON ip_assets(asset_number);
CREATE INDEX idx_asset_status ON ip_assets(status);
CREATE INDEX idx_asset_jurisdiction ON ip_assets(jurisdiction);
CREATE INDEX idx_asset_filing_date ON ip_assets(filing_date);

CREATE INDEX idx_filing_asset_id ON filings(ip_asset_id);
CREATE INDEX idx_filing_user_id ON filings(user_id);
CREATE INDEX idx_filing_status ON filings(status);
CREATE INDEX idx_filing_number ON filings(filing_number);

CREATE INDEX idx_feedback_filing_id ON filing_feedback(filing_id);
CREATE INDEX idx_feedback_admin_id ON filing_feedback(admin_id);

CREATE INDEX idx_activity_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_action ON activity_logs(action);
CREATE INDEX idx_activity_created ON activity_logs(created_at);

CREATE INDEX idx_notification_user_id ON notifications(user_id);
CREATE INDEX idx_notification_read ON notifications(is_read);
CREATE INDEX idx_notification_type ON notifications(type);

-- ============================================
-- Triggers for Auto-Update
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_filings_updated_at BEFORE UPDATE ON filings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Entity Relationships

```
User (1) ──────────── (1) Subscription
  │
  ├── (1:Many) ──────► Activity Logs
  ├── (1:Many) ──────► Notifications
  ├── (1:Many) ──────► Filings
  └── (1:1) ─────────► UI Preferences

IPAsset (1) ───────── (Many) Filings

Filing (1) ────────── (Many) Filing Feedback
  │
  └── (Many:1) ──────► User (admin)
```

---

## 🛡️ Security & Validation

### Multi-Layer Security Architecture

#### 1. Authentication Layer
```java
// JWT Token Generation (JwtUtil.java)
public String generateToken(String email) {
    return Jwts.builder()
        .setSubject(email)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000))
        .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
        .compact();
}

// Firebase Token Verification
public String verifyFirebaseToken(String idToken) {
    FirebaseToken decodedToken = FirebaseAuth.getInstance()
        .verifyIdToken(idToken);
    return decodedToken.getUid();
}
```

#### 2. Authorization Layer
```java
// Role-Based Access Control (SecurityConfig.java)
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/subscription/**").hasAnyRole("USER", "ADMIN")
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

#### 3. Data Protection
- **Password Encryption:** BCrypt with 10 salt rounds
- **SQL Injection Prevention:** JPA parameterized queries
- **XSS Protection:** Input sanitization in DTOs
- **CSRF Protection:** Disabled for stateless JWT

#### 4. CORS Configuration
```java
// CorsConfig.java
@Bean
public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "http://192.168.*.*"  // Dynamic local network
    ));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowCredentials(true);
    return new CorsFilter(source);
}
```

### Data Validation Pipeline

**1. Controller Layer (DTO Validation)**
```java
@PostMapping("/register")
public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    // @Valid triggers Bean Validation
}

// RegisterRequest.java
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
```

**2. Service Layer (Business Logic Validation)**
```java
// IPAssetService.java
public IPAsset save(IPAsset asset) {
    if (repository.existsByAssetNumber(asset.getAssetNumber())) {
        throw new DuplicateResourceException("Patent already exists");
    }
    return repository.save(asset);
}
```

**3. Repository Layer (Database Constraints)**
```sql
ALTER TABLE ip_assets 
ADD CONSTRAINT unique_asset_number UNIQUE (asset_number);
```

### Security Logging
```java
// ActivityLoggerService.java
@Async
public void logActivity(Long userId, String action, String resourceType) {
    ActivityLog log = new ActivityLog();
    log.setUserId(userId);
    log.setAction(action);
    log.setResourceType(resourceType);
    log.setIpAddress(requestContext.getRemoteAddr());
    log.setCreatedAt(LocalDateTime.now());
    repository.save(log);
}
```

---

## 🎯 Advanced Features

### 1. Subscription Engine Architecture

**Pricing Calculation Algorithm:**
```java
// SubscriptionService.java
public double calculateAmount(PlanType plan, BillingCycle cycle) {
    double basePrice = switch(plan) {
        case INVENTOR_BASIC -> 0.0;
        case IP_PROFESSIONAL -> 199.0;
        case GLOBAL_ENTERPRISE -> 499.0;
    };
    
    if (cycle == BillingCycle.YEARLY) {
        return basePrice * 12 * 0.8; // 20% annual discount
    }
    return basePrice;
}
```

**Pro-Rated Upgrade Logic:**
```java
@Transactional
public SubscriptionDTO upgradeSubscription(String uid, PlanType newPlan, BillingCycle newCycle) {
    Subscription current = findActiveSubscription(uid);
    
    // Calculate unused days
    long daysRemaining = ChronoUnit.DAYS.between(
        LocalDate.now(), 
        current.getRenewalDate()
    );
    
    // Pro-rated credit
    double dailyRate = current.getAmount() / 30;
    double credit = dailyRate * daysRemaining;
    
    // New amount
    double newAmount = calculateAmount(newPlan, newCycle) - credit;
    
    // Update subscription
    current.setPlanType(newPlan);
    current.setBillingCycle(newCycle);
    current.setAmount(newAmount);
    current.setRenewalDate(calculateRenewalDate(newCycle));
    
    return repository.save(current);
}
```

### 2. Analytics Engine

**Real-Time Metrics Calculation:**
```java
// AnalyticsService.java
public DashboardMetrics getDashboardMetrics() {
    return DashboardMetrics.builder()
        .dau(calculateDAU())
        .totalSearches(getTotalSearches())
        .activeSubscriptions(getActiveSubscriptions())
        .revenueThisMonth(calculateMonthlyRevenue())
        .topJurisdictions(getTopJurisdictions(5))
        .searchTrends(getSearchTrends(30))
        .build();
}

private long calculateDAU() {
    LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
    return activityLogRepository.countDistinctUsersByActionAndDate(
        "SEARCH", yesterday
    );
}
```

**Geographic Clustering:**
```java
// GeoService.java
public List<GeoCluster> generateClusters(List<IPAsset> assets) {
    Map<String, Long> jurisdictionCounts = assets.stream()
        .collect(Groupers.groupingBy(
            IPAsset::getJurisdiction,
            Collectors.counting()
        ));
    
    return jurisdictionCounts.entrySet().stream()
        .map(entry -> new GeoCluster(
            entry.getKey(),
            getCoordinates(entry.getKey()),
            entry.getValue()
        ))
        .sorted(Comparator.comparing(GeoCluster::getCount).reversed())
        .collect(Collectors.toList());
}
```

### 3. Filing Tracker System

**Status Workflow Management:**
```java
// FilingTrackerService.java
public void updateStatus(Long filingId, FilingStatus newStatus, Long adminId) {
    Filing filing = filingRepository.findById(filingId)
        .orElseThrow(() -> new ResourceNotFoundException("Filing not found"));
    
    // Validate status transition
    if (!isValidTransition(filing.getStatus(), newStatus)) {
        throw new InvalidStatusTransitionException(
            "Cannot transition from " + filing.getStatus() + " to " + newStatus
        );
    }
    
    // Update status
    filing.setStatus(newStatus);
    filing.setUpdatedAt(LocalDateTime.now());
    filingRepository.save(filing);
    
    // Log activity
    activityLoggerService.logActivity(
        adminId, 
        "UPDATE_FILING_STATUS", 
        "FILING"
    );
    
    // Send notification
    notificationService.sendFilingStatusUpdate(
        filing.getUserId(),
        filing.getId(),
        newStatus
    );
}

private boolean isValidTransition(FilingStatus from, FilingStatus to) {
    Map<FilingStatus, List<FilingStatus>> transitions = Map.of(
        FilingStatus.PENDING, List.of(FilingStatus.UNDER_REVIEW, FilingStatus.REJECTED),
        FilingStatus.UNDER_REVIEW, List.of(FilingStatus.PUBLISHED, FilingStatus.REJECTED),
        FilingStatus.PUBLISHED, List.of(FilingStatus.GRANTED, FilingStatus.ABANDONED)
    );
    return transitions.getOrDefault(from, List.of()).contains(to);
}
```

### 4. Notification System

**Event-Driven Notifications:**
```java
// NotificationService.java
@Async
public void sendFilingStatusUpdate(Long userId, Long filingId, FilingStatus status) {
    Notification notification = Notification.builder()
        .userId(userId)
        .title("Filing Status Updated")
        .message("Your filing #" + filingId + " is now " + status)
        .type(NotificationType.INFO)
        .category("FILING")
        .actionUrl("/filings/" + filingId)
        .isRead(false)
        .build();
    
    notificationRepository.save(notification);
    
    // Send real-time via WebSocket (if connected)
    messagingTemplate.convertAndSendToUser(
        userId.toString(),
        "/queue/notifications",
        notification
    );
}
```

### 5. Admin Monitoring Dashboard

**System Health Checks:**
```java
// AdminMonitoringService.java
public SystemHealth getSystemHealth() {
    return SystemHealth.builder()
        .uptime(getUptime())
        .activeSessions(getActiveSessions())
        .databaseStatus(checkDatabase())
        .apiHealth(checkExternalAPIs())
        .memoryUsage(getMemoryUsage())
        .diskSpace(getDiskSpace())
        .build();
}

private APIHealth checkExternalAPIs() {
    Map<String, Boolean> apiStatus = new HashMap<>();
    
    // Check SerpAPI
    try {
        externalIPService.healthCheck();
        apiStatus.put("SerpAPI", true);
    } catch (Exception e) {
        apiStatus.put("SerpAPI", false);
    }
    
    // Check WIPO
    try {
        wipoPatentService.healthCheck();
        apiStatus.put("WIPO", true);
    } catch (Exception e) {
        apiStatus.put("WIPO", false);
    }
    
    return new APIHealth(apiStatus);
}
```

---

## 🧪 Testing

### Unit Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=SubscriptionServiceTest

# Run tests with coverage
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

**Example Unit Test:**
```java
// SubscriptionServiceTest.java
@SpringBootTest
class SubscriptionServiceTest {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    @MockBean
    private SubscriptionRepository repository;
    
    @Test
    void testCalculateYearlyDiscount() {
        double monthlyPrice = 199.0;
        PlanType plan = PlanType.IP_PROFESSIONAL;
        BillingCycle cycle = BillingCycle.YEARLY;
        
        double result = subscriptionService.calculateAmount(plan, cycle);
        
        assertEquals(1910.40, result, 0.01); // 199 * 12 * 0.8
    }
    
    @Test
    void testUpgradeSubscription() {
        // Given
        Subscription current = createMockSubscription();
        when(repository.findByUserIdAndStatus(anyLong(), any()))
            .thenReturn(Optional.of(current));
        
        // When
        SubscriptionDTO result = subscriptionService.upgradeSubscription(
            "user123", 
            PlanType.GLOBAL_ENTERPRISE, 
            BillingCycle.YEARLY
        );
        
        // Then
        assertEquals(PlanType.GLOBAL_ENTERPRISE, result.getPlanType());
        assertEquals(BillingCycle.YEARLY, result.getBillingCycle());
        verify(repository, times(1)).save(any());
    }
}
```

### Integration Testing

```bash
# Run integration tests
mvn verify

# Run with specific profile
mvn verify -Pintegration-test
```

**Example Integration Test:**
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class SearchControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void testSearchWithAPISource() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getValidToken());
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<SearchResultDTO> response = restTemplate.exchange(
            "/api/search?source=api&q=blockchain",
            HttpMethod.GET,
            entity,
            SearchResultDTO.class
        );
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getResults().size() > 0);
    }
}
```

### API Testing with cURL

```bash
# Set variables
BASE_URL="http://localhost:5001"

# 1. Register user
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456"
  }'

# 2. Login and extract token
TOKEN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }' | jq -r '.token')

# 3. Search patents
curl -X GET "$BASE_URL/api/search?source=api&q=artificial+intelligence" \
  -H "Authorization: Bearer $TOKEN"

# 4. Get subscription status
curl -X GET "$BASE_URL/api/subscription/status/user123" \
  -H "Authorization: Bearer $TOKEN"

# 5. Upgrade subscription
curl -X POST "$BASE_URL/api/subscription/upgrade" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user123",
    "planType": "IP_PROFESSIONAL",
    "billingCycle": "YEARLY"
  }'

# 6. Get analytics (admin only)
ADMIN_TOKEN="your-admin-token"
curl -X GET "$BASE_URL/api/admin/analytics/dau" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 7. Update filing status
curl -X PUT "$BASE_URL/api/filings/1/status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "PUBLISHED"}'

# 8. Get notifications
curl -X GET "$BASE_URL/api/notifications" \
  -H "Authorization: Bearer $TOKEN"
```

### Postman Collection

Import this collection for comprehensive API testing:

```json
{
  "info": {
    "name": "Global IP Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"{{user_name}}\",\n  \"email\": \"{{user_email}}\",\n  \"password\": \"{{user_password}}\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/register",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "register"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5001"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Symptoms | Root Cause | Solution | Service/Component Affected |
|-------|----------|-----------|----------|----------------------------|
| **Port 5001 in use** | "Address already in use" error | Another process occupying port | `lsof -ti:5001 \| xargs kill -9` or change `server.port` in application.properties | Spring Boot Server |
| **Database connection failed** | "Connection refused" | PostgreSQL not running | `sudo service postgresql start` or `brew services start postgresql` | All Repository classes |
| **Firebase initialization error** | "Project ID not found" | Incorrect Firebase configuration | Verify project ID in `FirebaseConfig.java` and serviceAccountKey.json | `CustomUserDetailsService` |
| **JWT token expired** | 401 Unauthorized after 24h | Token expiration reached | Re-login to obtain new token via `/api/auth/login` | `JwtUtil`, `SecurityConfig` |
| **CORS error** | "Blocked by CORS policy" | Frontend URL not whitelisted | Add URL to `cors.allowed-origins` in `CorsConfig.java` | `CorsConfig` |
| **SerpAPI quota exceeded** | "API key limit reached" | Daily/monthly limit hit | Wait for reset or upgrade plan at serpapi.com | `ExternalIPService` |
| **Sensitive data exposed** | Git shows .properties file | File not in .gitignore | Run `git rm --cached src/main/resources/application.properties` and add to .gitignore | Configuration |
| **Network timeout** | "Connection timeout" | Local IP changed via DHCP | Update `API_BASE_URL` in frontend .env and whitelist in Firebase Console | `UnifiedSearchService` |
| **OAuth error** | "Unauthorized domain" | Local IP not authorized | Add IP to Firebase Console → Authentication → Settings → Authorized domains | Firebase Auth |
| **Theme flicker on refresh** | Page shows light mode briefly | State not persisting | Check `UIPreferenceService` initialization and LocalStorage sync in `App.jsx` | `UIPreferenceService` |
| **Duplicate patent entries** | Same patent appears twice | Deduplication logic bypassed | Verify `existsByAssetNumber` in `IPAssetService.save()` | `IPAssetService` |
| **Notification not received** | User doesn't get alerts | WebSocket connection dropped | Check `NotificationService` and reconnect WebSocket in frontend | `NotificationService` |
| **Filing status stuck** | Status won't update | Invalid transition | Review `FilingTrackerService.isValidTransition()` logic | `FilingTrackerService` |
| **Analytics showing zero** | Dashboard metrics empty | Activity logging disabled | Ensure `ActivityLoggerService` is being called on user actions | `AnalyticsService`, `ActivityLoggerService` |
| **Memory leak** | Application slows over time | Unclosed database connections | Check Repository method calls and add `@Transactional` where needed | All Service classes |

### Debug Configuration

**Enable detailed logging:**

```properties
# application.properties
logging.level.com.project.backend=DEBUG
logging.level.org.springframework.security=INFO
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Log file configuration
logging.file.name=logs/global-ip-platform.log
logging.file.max-size=10MB
logging.file.max-history=30
```

**Service-specific logging:**

```java
// Add to any service class
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SubscriptionService {
    
    public SubscriptionDTO upgradeSubscription(...) {
        log.info("Upgrading subscription for user: {}", uid);
        log.debug("Plan: {}, Cycle: {}", newPlan, newCycle);
        
        try {
            // logic
        } catch (Exception e) {
            log.error("Subscription upgrade failed", e);
            throw e;
        }
    }
}
```

### Health Check Endpoints

```bash
# Overall application health
curl http://localhost:5001/actuator/health

# Database connectivity
curl http://localhost:5001/actuator/health/db

# Disk space
curl http://localhost:5001/actuator/health/diskSpace

# Custom admin health endpoint
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:5001/api/admin/health
```

### Common Service-Specific Issues

**ExternalIPService:**
```java
// Test SerpAPI connection
curl "https://serpapi.com/search?api_key=YOUR_KEY&engine=google_patents&q=test"

// Check rate limit
log.info("API calls remaining: {}", externalIPService.getRemainingCalls());
```

**SubscriptionService:**
```sql
-- Check subscription states
SELECT user_id, plan_type, status, renewal_date 
FROM subscriptions 
WHERE status = 'ACTIVE';

-- Find expired subscriptions
SELECT * FROM subscriptions 
WHERE renewal_date < CURRENT_DATE AND status = 'ACTIVE';
```

**NotificationService:**
```sql
-- Unread notifications
SELECT user_id, COUNT(*) 
FROM notifications 
WHERE is_read = false 
GROUP BY user_id;

-- Clear old notifications
DELETE FROM notifications 
WHERE created_at < CURRENT_DATE - INTERVAL '30 days' AND is_read = true;
```

---

## 🛠️ Tech Stack

### Backend Technologies

| Category | Technology | Version | Purpose | Services Using |
|----------|-----------|---------|---------|----------------|
| **Core Framework** | Spring Boot | 3.2.3 | Application framework | All services |
| **Language** | Java | 17 (LTS) | Programming language | All classes |
| **Database** | PostgreSQL | 15+ | Relational database | All repositories |
| **ORM** | Hibernate/JPA | 6.1+ | Object-relational mapping | All entity classes |
| **Security** | Spring Security | 6.0+ | Authentication & authorization | `CustomUserDetailsService`, `SecurityConfig` |
| **JWT** | JJWT | 0.11.5 | Token management | `JwtUtil` |
| **Firebase** | Firebase Admin SDK | 9.2.0 | OAuth integration | `FirebaseConfig`, Auth controllers |
| **API Client** | RestTemplate | Built-in | HTTP client | `ExternalIPService`,

## 🛡️ Security & Validation

### Security Features

- **JWT Authentication** - 24-hour token expiry with HMAC-SHA256
- **BCrypt Encryption** - Secure password hashing (10 salt rounds)
- **Firebase Verification** - Server-side token validation
- **CORS Protection** - Configured for React frontend (port 5173)
- **Role-Based Access** - USER, ADMIN, PATENT_EXAMINER roles

### Data Validation

- **Duplicate Guard** - `existsByAssetNumber` prevents redundant records
- **Zero-State Protection** - Frontend handles empty search results
- **Input Sanitization** - JPA prepared statements prevent SQL injection
- **Token Expiry** - Automatic session management

---

## 🧪 Testing

### Quick Tests with cURL

```bash
# 1. Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123"}'

# 2. Login and get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'

# 3. Search patents (replace {TOKEN})
curl -X GET "http://localhost:5001/api/search?source=api&q=AI" \
  -H "Authorization: Bearer {TOKEN}"

# 4. Get analytics
curl -X GET http://localhost:5001/api/search/analysis \
  -H "Authorization: Bearer {TOKEN}"
```

### Run Unit Tests

```bash
mvn test
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5001 already in use | `lsof -ti:5001 \| xargs kill -9` or change port |
| Database connection failed | `sudo service postgresql start` |
| Firebase initialization error | Verify project ID in `FirebaseConfig.java` |
| JWT token expired | Re-login to get new token (24hr expiry) |
| CORS error | Add frontend URL to `cors.allowed-origins` |
| SerpAPI quota exceeded | Wait for reset or upgrade plan |
| Duplicate entries | Check `existsByAssetNumber` logic |

**Enable debug logging:**

```properties
logging.level.com.project.backend=DEBUG
logging.level.org.springframework.security=INFO
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Backend** | Spring Boot 3.2.3, Java 17 |
| **Database** | PostgreSQL 15+, Hibernate JPA |
| **Security** | Spring Security, JWT (JJWT 0.11.5), Firebase Admin SDK 9.2.0 |
| **APIs** | SerpAPI (Google Patents) |
| **Build Tool** | Maven 3.8+ |
| **Frontend Integration** | CORS enabled for React/Vite (port 5173) |

---

## 📞 Contact & Support

**Repository:** [global-ipi-platform](https://github.com/your-org/global-ipi-platform)  
**Branch:** team-five  
**Organization:** Infosys Springboard

**Team Contacts:**
- **Selvabarani K** - Data Persistence & APIs
- **Bhuvaneswari N** - External APIs & Analytics
- **Abhay Tripathi** - Firebase & OAuth

---

## 🎯 Key Achievements

✅ Dual-source patent search (API + Local)  
✅ Firebase + JWT authentication system  
✅ Auto-sync with deduplication  
✅ Real-time analytics dashboard  
✅ Geographic distribution mapping  
✅ Multi-jurisdictional data support  
✅ Zero-redundancy data persistence  
✅ Production-ready security

---

**Last Updated:** january, 2026 
**Version:** 1.0.0  
**Status:** ✅ Production Ready

*Developed for Global IP Intelligence Standards 2026*