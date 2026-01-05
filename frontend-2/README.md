# Global IP Intelligence Platform – Frontend

A **production-ready React frontend application** for the **Global IP Intelligence Platform**, built using **React 18 + Vite**, integrated with **Firebase Authentication (Google OAuth)**, a **JWT-secured Spring Boot backend**, and **AI-powered patent analysis**.

This frontend handles **UI, routing, authentication initiation, and API communication**.
All **authentication validation, authorization, and security enforcement** are handled by the backend.

---

## 📌 Project Information

* **Project Name:** Global IP Intelligence Platform
* **Module:** Frontend
* **Framework:** React 18
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Authentication:** Firebase (Google OAuth)
* **Authorization:** JWT (Backend generated)
* **Backend:** Spring Boot (Port `5001`)
* **AI Integration:** Gemini (via backend/service layer)
* **Last Updated:** December 16, 2025
* **Project Type:** Academic – Infosys Springboard
* **Status:** ✅ Complete & Stable

---

## 👥 Frontend Team Members

| Name               | Responsibility                                   |
| ------------------ | ------------------------------------------------ |
| **Abhay Tripathi** | Frontend–Backend Auth Flow, Firebase Integration |
| **Sarvatha R**     | UI Pages & Layout Structure                      |
| **Aarthi**         | Dashboard, Profile & Patent UI                   |

---

## 🎯 Purpose of Frontend

The frontend is responsible for:

* Rendering responsive UI
* Handling Google OAuth via Firebase
* Managing JWT lifecycle on client
* Calling secured backend APIs
* Displaying patent data & AI insights
* Protecting routes from unauthorized access

⚠️ **Security Rule:**
Frontend never decides user validity — backend always verifies JWT.

---

## ✨ Key Features

### 🔐 Authentication

* Email/Password login
* Google Sign-In (Firebase)
* Backend-verified JWT tokens
* Auto logout on token expiry

### 📊 Dashboard

* User-specific dashboard
* Protected layout

### 📁 Patent Module

* Patent listing
* New filing UI
* AI-based analysis page

### 👤 Profile & Settings

* View & update profile
* User settings management

### 🤖 AI Analysis

* Patent insights & summaries
* Gemini-powered analysis (via service)

### 📱 Responsive Design

* Mobile-first UI
* Tailwind CSS based

---

## 🧠 High-Level Architecture

```
React UI
   ↓
Axios Client (JWT Interceptor)
   ↓
Spring Boot REST APIs
   ↓
PostgreSQL / Firebase
   ↓
Gemini AI
```

---

## 🛠️ Technology Stack

| Layer      | Technology      |
| ---------- | --------------- |
| UI         | React 18        |
| Build Tool | Vite            |
| Styling    | Tailwind CSS    |
| Routing    | React Router    |
| API Client | Axios           |
| Auth       | Firebase JS SDK |
| Tokens     | JWT             |
| AI         | Gemini          |

---

## 📋 Prerequisites

* Node.js ≥ 18
* npm or yarn
* Backend running on `http://localhost:5001`
* Firebase project with Google Sign-In enabled

---

## 📁 COMPLETE FRONTEND FOLDER STRUCTURE (ACTUAL)

```
frontend/
│
├── .vscode/                     # VS Code workspace settings
│
├── node_modules/                # Installed dependencies (auto-generated)
│
├── src/
│   │
│   ├── api/
│   │   └── client.js            # Axios instance + JWT interceptor
│   │
│   ├── components/              # Application pages & layouts
│   │   ├── AnalysisPage.jsx     # AI-based patent analysis UI
│   │   ├── AuthLayout.jsx       # Public auth layout
│   │   ├── DashboardHome.jsx    # Dashboard landing page
│   │   ├── DashboardLayout.jsx  # Protected dashboard layout
│   │   ├── LandingPage.jsx      # Public landing page
│   │   ├── LoginPage.jsx        # Login & Google OAuth UI
│   │   ├── NewFilingPage.jsx    # New patent filing UI
│   │   ├── PatentsPage.jsx      # Patent listing & tracking
│   │   ├── ProfilePage.jsx      # User profile page
│   │   └── SettingsPage.jsx     # User settings
│   │
│   ├── services/
│   │   └── ai.js                # Gemini AI service integration
│   │
│   ├── App.jsx                  # Route definitions & layouts
│   ├── firebase.js              # Firebase initialization
│   ├── index.jsx                # React entry point
│   └── index.css                # Global styles (Tailwind)
│
├── .env                         # Environment variables (ignored)
├── .gitignore                   # Git ignore rules
├── currentstatus.md             # Internal development notes
├── index.html                   # Root HTML template
├── metadata.json                # Project metadata
├── package.json                 # Scripts & dependencies
├── package-lock.json            # Dependency lock
├── postcss.config.js            # PostCSS config
├── tailwind.config.js           # Tailwind config
├── tsconfig.json                # Future TypeScript support
└── README.md                    # Frontend documentation
```

---

## ⚙️ Environment Configuration

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5001

VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=1:xxx:web:xxx
```

⚠️ **Never commit `.env`**

---

## 🔐 Authentication Flow

### Google Login

```
User clicks Google Login
↓
Firebase signInWithPopup()
↓
Firebase ID Token generated
↓
POST /api/auth/firebase-login
↓
Backend verifies token
↓
Backend returns JWT
↓
JWT stored in localStorage
```

---

## 🔒 JWT Handling

* Stored in `localStorage`
* Auto-attached via Axios interceptor (`client.js`)
* Removed on:

  * Logout
  * 401 Unauthorized response

---

## 🛡️ Route Protection

Protected pages:

* Dashboard
* Patents
* Profile
* Analysis

Handled using:

* `DashboardLayout.jsx`
* JWT presence check
* Backend validation per request

---

## 🔗 Backend API Mapping

| Feature | Endpoint                 |
| ------- | ------------------------ |
| Auth    | `/api/auth/**`           |
| Users   | `/api/users/**`          |
| Patents | `/api/patents/**`        |
| Profile | `/api/profile/**`        |
| Swagger | `/swagger-ui/index.html` |

---

## 🚀 Running the Application

```bash
npm install
npm run dev
```

Open browser:

```
http://localhost:5173
```

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

Build output:

```
dist/
```

Deployable on:

* Vercel
* Netlify
* Nginx
* AWS S3

---

## 🔐 Security Best Practices

* No secrets in code
* JWT validated server-side
* Firebase used only for OAuth
* CORS restricted
* HTTPS required in production

---

## 🏁 Final Status

| Module           | Status |
| ---------------- | ------ |
| UI Pages         | ✅      |
| Auth             | ✅      |
| Firebase         | ✅      |
| Backend Sync     | ✅      |
| AI Integration   | ✅      |
| Production Ready | ✅      |

---

**Last Updated:** December 16, 2025
**Version:** 1.0.0
**License:** Academic – Infosys Springboard
**Status:** ✅ COMPLETE
