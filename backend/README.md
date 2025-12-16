# Backend - Spring Boot Application with Firebase Authentication

**Project:** Global IP Intelligence Platform  
**Description:** A full-stack web platform designed to help innovators, law firms, and R&D teams monitor global intellectual property activity, powered by React, Spring Boot, and Google Gemini AI.  
**Last Updated:** December 16, 2025  
**Framework:** Spring Boot 3.x  
**Language:** Java 17+  
**Build Tool:** Maven

---

## 👥 Team Members

| Name | Role | Contribution |
|------|------|--------------|
| **Selvabarani K** | Backend Developer | APIs Development, JWT & OAuth2 Authentication Implementation |
| **Bhuvaneswari N** | Backend Developer | Backend Setup, Database Design & Entity Configuration |
| **Abhay Tripathi** | Backend Developer | Firebase Authentication Integration, Google OAuth Implementation, Firebase Admin SDK Setup |

**Project Type:** Academic Project - Infosys Springboard  
**Development Period:** 2025  
**Tech Stack:** Spring Boot 3.x, PostgreSQL, Firebase Admin SDK, JWT, BCrypt  
**GitHub Repository:** [global-ipi-platform](https://github.com/Springboard-Mentor/global-ipi-platform/tree/team-five)

---

## 📋 Table of Contents

- [Team Members](#-team-members)
- [Project Overview](#-project-overview)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Dependencies](#-dependencies)
- [Configuration](#️-configuration)
- [Running the Application](#-running-the-application)
- [Firebase Authentication Integration](#-firebase-authentication-integration)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#️-database-schema)
- [Security Configuration](#-security-configuration)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Contact & Support](#-contact--support)

---

## 🎯 Project Overview

This is a comprehensive Spring Boot backend application that provides:

- ✅ **User Management System** with CRUD operations
- ✅ **Dual Authentication Methods**: Email/Password & Google OAuth (via Firebase)
- ✅ **JWT Token-Based Security**
- ✅ **Patent Management System**
- ✅ **User Profile Management**
- ✅ **Role-Based Access Control**
- ✅ **RESTful API Architecture**
- ✅ **PostgreSQL Database Integration**
- ✅ **Firebase Admin SDK Integration**
- ✅ **BCrypt Password Encryption**

---

## 📁 Project Structure

```
backend/
├── .mvn/wrapper/
├── src/
│   ├── main/
│   │   ├── java/com/project/backend/
│   │   │   ├── config/
│   │   │   │   ├── FirebaseConfig.java          # Firebase Admin SDK initialization
│   │   │   │   └── SecurityConfig.java          # Spring Security configuration
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java          # Authentication endpoints
│   │   │   │   ├── PatentController.java        # Patent management endpoints
│   │   │   │   ├── ProfileController.java       # User profile endpoints
│   │   │   │   └── UserController.java          # User management endpoints
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java            # Login request DTO
│   │   │   │   └── RegisterRequest.java         # Registration request DTO
│   │   │   ├── entity/
│   │   │   │   ├── Role.java                    # User role entity
│   │   │   │   └── User.java                    # User entity with Firebase support
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java          # User data access layer
│   │   │   ├── service/
│   │   │   │   └── UserService.java             # Business logic layer
│   │   │   ├── util/
│   │   │   │   └── JwtUtil.java                 # JWT token utility
│   │   │   └── BackendApplication.java          # Main application class
│   │   └── resources/
│   │       ├── application.properties           # Main configuration
│   │       └── serviceAccountKey.json           # Firebase credentials (NEVER COMMIT!)
│   └── test/java/com/project/backend/
│       └── BackendApplicationTests.java
├── target/                                       # Compiled files (ignored)
├── .gitignore                                    # Git ignore rules
├── README.md                                     # This file
├── maven-wrapper.properties
└── pom.xml                                       # Maven dependencies
```

---

## ✅ Prerequisites

Before running this application, ensure you have:

- **Java 17 or higher** installed
- **Maven 3.8+** installed
- **PostgreSQL 14+** database server running
- **Firebase Project** created (for Google authentication)
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code with Java extensions

### Check Installations

```bash
# Check Java version
java -version
# Expected: java version "17.0.x" or higher

# Check Maven version
mvn -version
# Expected: Apache Maven 3.8.x or higher

# Check PostgreSQL
psql --version
# Expected: psql (PostgreSQL) 14.x or higher
```

---

## 📦 Dependencies

### Core Dependencies (from `pom.xml`)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Firebase Admin SDK -->
    <dependency>
        <groupId>com.google.firebase</groupId>
        <artifactId>firebase-admin</artifactId>
        <version>9.2.0</version>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok (Optional but recommended) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## ⚙️ Configuration

### `application.properties`

Located at: `src/main/resources/application.properties`

```properties
# ==========================================
# SERVER CONFIGURATION
# ==========================================
server.port=5001

# ==========================================
# DATABASE CONFIGURATION (PostgreSQL)
# ==========================================
spring.datasource.url=jdbc:postgresql://localhost:5432/infosys_db
spring.datasource.username=postgres
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=org.postgresql.Driver

# ==========================================
# JPA / HIBERNATE CONFIGURATION
# ==========================================
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# ==========================================
# JWT CONFIGURATION
# ==========================================
jwt.secret=your-secret-key-minimum-256-bits-change-this-in-production
jwt.expiration=86400000

# ==========================================
# LOGGING CONFIGURATION
# ==========================================
logging.level.com.project.backend=DEBUG
logging.level.org.springframework.security=INFO
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# ==========================================
# CORS CONFIGURATION
# ==========================================
cors.allowed-origins=http://localhost:5173
```

### Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE infosys_db;

# Connect to database
\c infosys_db;

# Check tables (after first run)
\dt

# Exit PostgreSQL
\q
```

---

## 🚀 Running the Application

### Option 1: Using Maven Command Line

```bash
# Navigate to backend directory
cd backend

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

### Option 2: Using IDE

1. Open project in **IntelliJ IDEA** / **Eclipse** / **VS Code**
2. Locate `src/main/java/com/project/backend/BackendApplication.java`
3. Right-click → **Run 'BackendApplication'**

### Expected Console Output

```
✅ Firebase Initialized Successfully!

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.3)

2025-12-16 13:46:47 INFO  Started BackendApplication in 8.216 seconds
2025-12-16 13:46:47 INFO  Tomcat started on port 5001 (http)
```

### Verify Application is Running

```bash
# Test backend health
curl http://localhost:5001/

# Expected: API is running or error page (means server is up)
```

---

## 🔥 Firebase Authentication Integration

**Implemented by:** Abhay Tripathi (Backend Integration)  
**Integration Type:** Firebase Admin SDK + Google OAuth

This backend integrates Firebase Authentication for Google Sign-In capabilities.

### Setup Steps

#### 1. **Firebase Console Setup**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/Select project: `global-ipi-platform`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Google** provider
5. Add authorized domain: `localhost`

#### 2. **Service Account Key (Optional - Production)**

For production with full Firebase Admin SDK features:

1. Firebase Console → **Project Settings** (⚙️) → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Save as `serviceAccountKey.json` in `backend/src/main/resources/`
4. **⚠️ NEVER commit this file to Git!** (Already in `.gitignore`)

#### 3. **Development Setup (Current)**

The application uses minimal Firebase initialization (no service account needed):

```java
// FirebaseConfig.java
FirebaseOptions options = FirebaseOptions.builder()
    .setProjectId("global-ipi-platform")
    .build();
```

This is sufficient for Firebase token verification during development.

### How Firebase Auth Works

```
┌──────────────────────────────────────────────────────────┐
│           Firebase Authentication Flow                    │
└──────────────────────────────────────────────────────────┘

Frontend (React)
    │
    ├─→ User clicks "Sign in with Google"
    │
    ↓
Firebase JS SDK (signInWithPopup)
    │
    ├─→ Google OAuth Consent Screen
    │
    ↓
User Approves → Firebase ID Token Generated
    │
    ↓
POST /api/auth/firebase-login
    │
    ├─→ { idToken: "eyJhbGci..." }
    │
    ↓
Backend (Spring Boot)
    │
    ├─→ FirebaseAuth.getInstance().verifyIdToken(idToken)
    │
    ├─→ Extract: firebaseUid, email, name
    │
    ├─→ UserService.findOrCreateFirebaseUser()
    │   │
    │   ├─→ Check by firebaseUid → Found? Return user
    │   │
    │   ├─→ Check by email → Found? Update to FIREBASE
    │   │
    │   └─→ Not Found? Create new user
    │
    ├─→ Generate JWT Token (JwtUtil)
    │
    ↓
Response: { token: "JWT...", user: {...} }
    │
    ↓
Frontend stores JWT in localStorage
    │
    └─→ Subsequent API calls include: Authorization: Bearer JWT
```

---

## 🚀 API Endpoints

### Authentication Endpoints

#### 1. **Register (Email/Password)**

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "userType": "Individual"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "Individual",
    "authProvider": "LOCAL",
    "role": "USER",
    "createdAt": "2025-12-16T13:46:00"
  }
}
```

#### 2. **Login (Email/Password)**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "authProvider": "LOCAL"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

#### 3. **Firebase Login (Google OAuth)**

```http
POST /api/auth/firebase-login
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFkYzBmM..."
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@gmail.com",
    "userType": "Individual",
    "authProvider": "FIREBASE",
    "firebaseUid": "firebase-uid-abc123",
    "role": "USER"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Authentication failed: Invalid Firebase token."
}
```

### User Management Endpoints

#### 4. **Get All Users** (Protected)

```http
GET /api/users
Authorization: Bearer {JWT_TOKEN}
```

#### 5. **Get User by ID** (Protected)

```http
GET /api/users/{id}
Authorization: Bearer {JWT_TOKEN}
```

#### 6. **Update User** (Protected)

```http
PUT /api/users/{id}
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### 7. **Delete User** (Protected)

```http
DELETE /api/users/{id}
Authorization: Bearer {JWT_TOKEN}
```

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'Individual',
    auth_provider VARCHAR(20) DEFAULT 'LOCAL',
    firebase_uid VARCHAR(255) UNIQUE,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_auth_provider ON users(auth_provider);
```

### Column Descriptions

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key, auto-increment |
| `name` | VARCHAR(255) | User's full name |
| `email` | VARCHAR(255) | Unique email address |
| `password` | VARCHAR(255) | BCrypt encrypted password |
| `user_type` | VARCHAR(50) | Individual/Organization/Law Firm |
| `auth_provider` | VARCHAR(20) | LOCAL or FIREBASE |
| `firebase_uid` | VARCHAR(255) | Firebase user ID (for Google auth) |
| `role` | VARCHAR(20) | USER/ADMIN/PATENT_EXAMINER |
| `created_at` | TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | Last modification timestamp |

---

## 🔒 Security Configuration

### Key Security Features

1. **JWT Token Authentication**
   - Tokens expire after 24 hours (86400000 ms)
   - Stateless session management
   - Bearer token in Authorization header
   - HMAC-SHA256 signing algorithm

2. **Password Encryption**
   - BCrypt hashing algorithm
   - Salt rounds: 10 (default)
   - No plain text passwords stored
   - Rainbow table attacks prevented

3. **CORS Configuration**
   - Allows `localhost:5173` (frontend development)
   - Configurable for production domains
   - Credentials enabled for cookies/auth headers

4. **Firebase Token Verification**
   - Server-side token validation
   - Token expiry checking (1 hour validity)
   - No client-side Firebase credentials exposed

### Protected Endpoints

| Endpoint | Authentication Required | Role Required |
|----------|-------------------------|---------------|
| `/api/auth/register` | No | None |
| `/api/auth/login` | No | None |
| `/api/auth/firebase-login` | No | None |
| `/api/users/**` | Yes (JWT) | USER |
| `/api/patents/**` | Yes (JWT) | USER |
| `/api/profile/**` | Yes (JWT) | USER |

---

## 🧪 Testing

### Manual Testing with cURL

#### 1. Register New User

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "userType": "Individual"
  }'
```

#### 2. Login with Email/Password

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

#### 3. Access Protected Endpoint

```bash
# Replace {TOKEN} with JWT received from login
curl -X GET http://localhost:5001/api/users \
  -H "Authorization: Bearer {TOKEN}"
```

### Testing with Postman

1. **Import Collection**: Create a new collection "IPI Backend"
2. **Set Base URL**: `http://localhost:5001`
3. **Add Authorization**: Bearer Token in Headers
4. **Test Flow**:
   - Register → Get token
   - Login → Verify token works
   - Access protected routes → Check authorization

---

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| **Port 5001 already in use** | Another service using port 5001 | Change `server.port` in `application.properties` or kill existing process |
| **Database connection failed** | PostgreSQL not running | Start PostgreSQL: `sudo service postgresql start` |
| **Firebase not initialized** | Wrong project ID | Check `FirebaseConfig.java` has correct project ID |
| **JWT token expired** | Token validity is 24 hours | Re-login to get new token |
| **CORS error from frontend** | Frontend URL not allowed | Add frontend URL to `cors.allowed-origins` |
| **401 Unauthorized** | Missing/invalid JWT token | Include `Authorization: Bearer {token}` header |
| **Hibernate SQL errors** | Database schema mismatch | Set `spring.jpa.hibernate.ddl-auto=update` |

### Debug Mode

To enable detailed logging:

```properties
# application.properties
logging.level.root=DEBUG
logging.level.com.project.backend=TRACE
```

### Database Connection Test

```bash
# Test PostgreSQL connection
psql -U postgres -d infosys_db -c "SELECT version();"

# Check if database exists
psql -U postgres -l | grep infosys_db
```

---

## 📦 Deployment

### Production Checklist

#### Security
- [ ] Update `jwt.secret` with strong secret key (minimum 256 bits)
- [ ] Change default database password
- [ ] Add Firebase service account key for production
- [ ] Enable HTTPS/TLS
- [ ] Set secure CORS origins (no `localhost`)

#### Configuration
- [ ] Update `spring.jpa.hibernate.ddl-auto=validate` (never use `create-drop` in production)
- [ ] Set `spring.profiles.active=prod`
- [ ] Configure environment variables for secrets
- [ ] Update `cors.allowed-origins` to production frontend URL

#### Database
- [ ] Use connection pooling (HikariCP configured by default)
- [ ] Set up database backups
- [ ] Create database indexes
- [ ] Configure max connections

#### Monitoring
- [ ] Set up application logging (ELK stack, CloudWatch, etc.)
- [ ] Configure health check endpoints
- [ ] Enable Spring Boot Actuator
- [ ] Set up error tracking (Sentry, Rollbar)

#### Performance
- [ ] Enable HTTP/2
- [ ] Configure caching (Redis/Memcached)
- [ ] Set up CDN for static assets
- [ ] Optimize database queries

### Environment Variables (Production)

```bash
# Database
export DB_URL=jdbc:postgresql://prod-server:5432/ipi_prod
export DB_USERNAME=prod_user
export DB_PASSWORD=secure_password

# JWT
export JWT_SECRET=your-production-secret-key-256-bits-minimum
export JWT_EXPIRATION=86400000

# Firebase
export FIREBASE_PROJECT_ID=global-ipi-platform
export FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json

# Server
export SERVER_PORT=5001
export CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 📞 Contact & Support

For questions or issues related to this backend:

| Team Member | Area of Expertise | Contact |
|-------------|-------------------|---------|
| **Selvabarani K** | APIs Development, JWT & OAuth2 | API & Authentication Issues |
| **Bhuvaneswari N** | Database & Entities | Database Configuration & Schema |
| **Abhay Tripathi** | Firebase Integration | Google OAuth & Firebase Setup |

**Project Repository:** [GitHub - global-ipi-platform](https://github.com/Springboard-Mentor/global-ipi-platform/tree/team-five)  
**Branch:** `team-five`  
**Organization:** Infosys Springboard

---

## 🎯 Key Achievements

✅ **Firebase Authentication** - Fully integrated Google OAuth with Firebase Admin SDK (Abhay Tripathi)  
✅ **JWT Security** - Token-based authentication system with 24-hour expiry (Selvabarani K)  
✅ **Database Design** - PostgreSQL schema with proper indexing & relationships (Bhuvaneswari N)  
✅ **RESTful APIs** - Complete CRUD operations with proper HTTP methods (Team Effort)  
✅ **CORS Configuration** - Secure frontend-backend communication enabled  
✅ **Error Handling** - Comprehensive exception management with proper status codes  
✅ **Password Security** - BCrypt encryption with salt rounds  
✅ **Dual Authentication** - Support for both Email/Password and Google OAuth

---

**Last Updated:** December 16, 2025  
**Version:** 1.0.0  
**License:** Academic Project - Infosys Springboard  
**Status:** ✅ Production Ready