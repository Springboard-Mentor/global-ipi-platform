# Global IP Intelligence Platform

A full-stack web platform designed to help innovators, law firms, and R&D teams monitor global intellectual property activity, powered by React, Spring Boot, and Google Gemini AI.

![Status](https://img.shields.io/badge/Frontend-100%25%20Complete-brightgreen)
![Backend](https://img.shields.io/badge/Backend-In%20Progress-yellow)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-green)

---

## 👥 Team Members

- **SARVATHA R** - Frontend Setup, Login Page
- **Abhay Tripathi** - Register Page
- **Aarthi** - Dashboard, Profile, Patents Pages & Backend Integration
- **SELVABARANI K** - APIs, Authentication (JWT/OAuth2)
- **BHUVANESWARI N** - Backend Setup, Database & Entities

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Milestone 1 Progress](#milestone-1-progress)
- [Database Schema](#database-schema)
- [Security](#security)
- [Contributing](#contributing)

---

## ✨ Features

### Frontend
- **IP Dashboard**: Monitor active patents, trademarks, and infringement risks
- **AI Assistant**: Legal intelligence assistant using Gemini 2.5 Flash for patent analysis
- **Patent Management**: Search, filter, and track patent portfolio
- **User Profile**: Manage user credentials and bio
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Backend
- **RESTful APIs**: Complete CRUD operations for IP management
- **JWT Authentication**: Secure token-based authentication
- **Spring Security**: Role-based access control
- **JPA Integration**: Efficient database operations with Hibernate
- **H2 Database**: In-memory database for development

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI Library |
| Vite | 4.4.5 | Build Tool |
| Tailwind CSS | 3.3.3 | Styling |
| Lucide React | 0.263.1 | Icons |
| React Router | Latest | Navigation |
| Axios | Latest | API Calls |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17+ | Programming Language |
| Spring Boot | 3.1.0 | Framework |
| Spring Data JPA | 3.1.0 | Data Persistence |
| Spring Security | 3.1.0 | Authentication & Authorization |
| Lombok | Latest | Boilerplate Reduction |
| H2 Database | Latest | Development Database |
| Maven | 3.8+ | Build Tool |

---

## 📁 Project Structure

```
global-ipi-platform/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/project/backend/
│   │   │   │   ├── config/          # Security & App Configuration
│   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   └── RegisterRequest.java
│   │   │   │   ├── entity/          # JPA Entities
│   │   │   │   │   ├── User.java
│   │   │   │   │   └── Role.java
│   │   │   │   ├── repository/      # Data Access Layer
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── service/         # Business Logic
│   │   │   │   │   └── UserService.java
│   │   │   │   ├── util/            # Utilities
│   │   │   │   └── BackendApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql
│   │   └── test/                    # Unit & Integration Tests
│   ├── target/                      # Build output
│   ├── pom.xml                      # Maven dependencies
│   └── HELP.md                      # Backend guide
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js            # API client configuration
│   │   ├── components/
│   │   │   ├── AnalysisPage.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NewFilingPage.jsx
│   │   │   ├── PatentsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── services/
│   │   │   └── ai.js                # AI service layer
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── node_modules/                # Dependencies
│   ├── dist/                        # Build output
│   ├── .env                         # Environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md                        # This file
```

---

## 📋 Prerequisites

### Backend
- Java 17 or higher
- Maven 3.8+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Frontend
- Node.js v18+
- npm or yarn

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Springboard-Mentor/global-ipi-platform.git
cd global-ipi-platform
```

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies and run
./mvnw spring-boot:run

# Or use Maven directly
mvn spring-boot:run
```

The backend server will start at `http://localhost:5001`

**Expected Output:**
```bash
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.3)

[INFO] Started BackendApplication in 9.547 seconds
Tomcat started on port 5001 (http) with context path ''
```

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

**Expected Output:**
```bash
VITE v4.5.14  ready in 485 ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.93.1:5173/
➜  Network: http://192.168.61.1:5173/
➜  Network: http://192.168.1.13:5173/
➜  press h to show help
```

---

## ⚙️ Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=5001

# Database Configuration (PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/ip_platform
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Security
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*

# Logging
logging.level.com.project.backend=INFO
logging.level.org.hibernate.SQL=DEBUG
```

### Frontend Configuration

Create `.env` file in `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_GEMINI_API_KEY=your_google_api_key_here
```

**Tailwind CSS Configuration** (`tailwind.config.js`):
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}
```

---

## 🏃 Running the Application

### Quick Start (Both Services)

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
✅ Backend running on http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

### Verify Everything is Working

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5001/api/health
   ```

2. **Database Connection:**
   - Open pgAdmin or use psql
   - Connect to `ip_platform` database
   - Verify `users` and `roles` tables exist

3. **Frontend Access:**
   - Open browser: http://localhost:5173
   - You should see the landing page
   - Navigate to `/register` to test registration

### Test the Integration

**Register a new user:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "userType": "innovator"
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com",
  "userType": "innovator",
  "createdAt": "2025-12-14T14:30:01.941+05:30"
}
```

### Production Build

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api
- **PostgreSQL**: localhost:5432 (database: ip_platform)
- **pgAdmin**: http://localhost (if installed)

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "userType": "innovator"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Endpoints

#### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

#### Get User by ID
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Delete User
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

---

## 🎯 Milestone 1 - COMPLETED ✅ (Delivered: 14.12.25)

### Frontend ✅ 100% Complete

**SARVATHA R:**
- ✅ Frontend Setup (React 18 + Vite + Tailwind CSS)
- ✅ LoginPage component (mockup + actual implementation)
- ✅ Responsive design with mobile-first approach
- ✅ Form validation and error handling
- ✅ Tailwind configuration optimized

**Abhay Tripathi:**
- ✅ RegisterPage component (mockup + actual implementation)
- ✅ Password strength indicator with visual feedback
- ✅ User type selection (Innovator/Law Firm/R&D Team)
- ✅ Responsive design across all devices
- ✅ Input validation and UX enhancements

**Aarthi:**
- ✅ DashboardHome component with stats cards
- ✅ ProfilePage component with edit functionality
- ✅ PatentsPage component with search/filter
- ✅ Backend integration completed
- ✅ API service layer implementation
- ✅ Complete routing setup

### Backend ✅ 100% Complete

**SELVABARANI K:**
- ✅ REST APIs development (Auth + User CRUD)
- ✅ Authentication endpoints (Register/Login)
- ✅ User CRUD operations with validation
- ✅ Spring Security configuration
- ✅ CORS configuration for frontend integration
- ✅ Exception handling and error responses

**BHUVANESWARI N:**
- ✅ Backend Setup (Spring Boot 3.2.3 + Maven)
- ✅ PostgreSQL database configuration (port 5432)
- ✅ Entity creation (User, Role) with Lombok
- ✅ Repository layer with Spring Data JPA
- ✅ Database schema auto-creation with Hibernate
- ✅ HikariCP connection pooling setup

### Integration ✅ 100% Complete
- ✅ Frontend-Backend API communication established
- ✅ CORS configured and working
- ✅ User registration flow fully functional
- ✅ Database persistence verified
- ✅ PostgreSQL + Spring Boot integration complete

---

## 🗄️ Database Schema

### User Entity

| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | Primary Key, Auto-increment |
| name | String | Not Null, Max 100 chars |
| email | String | Not Null, Unique |
| password | String | Not Null, Encrypted |
| userType | String | Not Null (innovator/law_firm/rd_team) |
| createdAt | Timestamp | Auto-generated |
| updatedAt | Timestamp | Auto-updated |

### Role Entity

| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | Primary Key, Auto-increment |
| name | String | Not Null, Unique |
| userId | Long | Foreign Key → User.id |

---

## 🔒 Security

### Authentication Flow

1. User registers/logs in with credentials
2. Backend validates and returns JWT token
3. Frontend stores token in memory (not localStorage)
4. Token included in Authorization header for subsequent requests
5. Backend validates token on protected endpoints

### Security Features

- **Password Encryption**: BCrypt hashing
- **JWT Tokens**: Stateless authentication
- **CORS Configuration**: Controlled cross-origin access
- **CSRF Protection**: Disabled for REST API (JWT provides protection)
- **Role-Based Access**: Different permissions for user types

---

## 🌐 Available Routes

### Frontend Routes

| Route | Component | Description | Protected |
|-------|-----------|-------------|-----------|
| `/` | LandingPage | Home page | No |
| `/login` | LoginPage | User login | No |
| `/register` | RegisterPage | User registration | No |
| `/dashboard` | DashboardHome | Main dashboard | Yes |
| `/patents` | PatentsPage | Patent management | Yes |
| `/profile` | ProfilePage | User profile | Yes |
| `/analysis` | AnalysisPage | AI analysis | Yes |
| `/settings` | SettingsPage | User settings | Yes |

---

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
mvn test

# Run specific test
mvn test -Dtest=UserServiceTest
```

### Frontend Testing

```bash
cd frontend

# Run tests (when configured)
npm test
```

---

## 📦 Build Commands

### Backend

```bash
# Clean build
mvn clean install

# Skip tests
mvn clean install -DskipTests

# Package
mvn package
```

### Frontend

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🤝 Contributing

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add: your feature description"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

### Commit Message Convention

- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Modification to existing feature
- `Refactor:` Code refactoring
- `Docs:` Documentation changes

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5001 already in use:**
```bash
# Find and kill process on port 5001 (Windows)
netstat -ano | findstr :5001
taskkill /PID <process_id> /F

# Or change port in application.properties
server.port=5002
```

**PostgreSQL connection failed:**
```bash
# Check if PostgreSQL is running
psql -U postgres -d ip_platform

# Verify credentials in application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ip_platform
spring.datasource.username=postgres
spring.datasource.password=your_password
```

**Maven build errors:**
```bash
# Clean and rebuild
./mvnw clean install -U

# Skip tests if needed
./mvnw clean install -DskipTests
```

### Frontend Issues

**Tailwind styles not working:**
- ✅ Fixed! The `content` array is now properly configured
- Restart dev server: `Ctrl+C` then `npm run dev`

**API calls failing (CORS errors):**
```javascript
// Verify .env file exists with correct URL
VITE_API_BASE_URL=http://localhost:5001/api

// Check backend CORS configuration in SecurityConfig.java
```

**Vite dev server issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Port 5173 already in use:**
```bash
# Vite will automatically use next available port (5174, 5175, etc.)
# Or specify custom port
npm run dev -- --port 3000
```

### Database Issues

**Tables not created:**
```bash
# Check Hibernate logs in backend terminal
# Look for: "create table users" and "create table roles"

# Verify application.properties setting
spring.jpa.hibernate.ddl-auto=update
```

**Cannot connect to PostgreSQL:**
```bash
# Check if PostgreSQL service is running (Windows)
services.msc → Find "postgresql-x64-16" → Start

# Check connection with pgAdmin
# Server: localhost
# Port: 5432
# Database: ip_platform
```

### Common Integration Issues

**Frontend can't reach backend:**
1. Verify backend is running: http://localhost:5001/api
2. Check browser console for CORS errors
3. Verify `.env` file in frontend directory
4. Check firewall settings

**User registration not working:**
1. Check backend logs for errors
2. Verify PostgreSQL connection
3. Test API endpoint directly with curl/Postman
4. Check password encryption is working

### Development Tips

**Hot Reload not working:**
- Frontend: Vite has fast HMR, save files to see changes instantly
- Backend: Spring Boot DevTools enabled, but full restart recommended for schema changes

**Viewing Database Changes:**
```sql
-- Connect to PostgreSQL
psql -U postgres -d ip_platform

-- View all users
SELECT * FROM users;

-- View all roles  
SELECT * FROM roles;

-- Check table structure
\d users
\d roles
```

---

## 📚 Resources

### Documentation

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/4.0.0/reference/html/)
- [Spring Data JPA](https://docs.spring.io/spring-boot/4.0.0/reference/sql.jpa-and-spring-data)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/)

### Guides

- Building RESTful Services: https://spring.io/guides/gs/rest-service/
- Spring Security: https://spring.io/guides/gs/securing-web/
- React Router: https://reactrouter.com/

---

## 📄 License

This project is developed as part of an educational initiative.

---

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact team members via project communication channels

---

**Current Status:** 
- Frontend: ✅ 100% Complete & Running (Port 5173)
- Backend: ✅ 100% Complete & Running (Port 5001)
- Database: ✅ PostgreSQL Connected (Port 5432)
- Integration: ✅ Fully Functional & Tested
- Milestone 1: ✅ DELIVERED (14.12.25)

**Last Updated:** December 14, 2025, 2:30 PM IST
