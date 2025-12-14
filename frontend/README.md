# Global IP Intelligence Platform - Frontend

A React-based Intellectual Property Intelligence Platform powered by Google Gemini AI.

![Status](https://img.shields.io/badge/Frontend-100%25%20Complete-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.3-cyan)

---

## 👥 Frontend Team Members

- **SARVATHA R** - Project Setup & Login Page
- **Abhay Tripathi** - Register Page
- **Aarthi** - Dashboard, Profile & Patents Pages

---

## ✨ Features

- **IP Dashboard**: Monitor active patents, trademarks, and infringement risks
- **AI Assistant**: Legal intelligence assistant using Gemini 2.5 Flash for patent analysis and drafting
- **Patent Management**: Search, filter, and track patent portfolio
- **User Profile**: Manage user credentials and bio
- **Responsive Design**: Built with Tailwind CSS and Lucide React icons

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI Library |
| Vite | 4.4.5 | Build Tool |
| Tailwind CSS | 3.3.3 | Styling |
| Lucide React | 0.263.1 | Icons |
| React Router | Latest | Navigation |
| Axios | Latest | API Calls |

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

---

## 🚀 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Springboard-Mentor/global-ipi-platform.git
cd global-ipi-platform/frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
API_KEY=your_actual_google_api_key_here
```

### 4️⃣ Start the development server

```bash
npm run dev
```

Open your browser at `http://localhost:5173`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js              # API client configuration
│   │
│   ├── components/
│   │   ├── AuthLayout.jsx         # Auth pages wrapper
│   │   ├── DashboardHome.jsx      # Main dashboard
│   │   ├── DashboardLayout.jsx    # Dashboard layout
│   │   ├── LandingPage.jsx        # Home page
│   │   ├── LoginPage.jsx          # Login form
│   │   ├── PatentsPage.jsx        # Patent management
│   │   ├── ProfilePage.jsx        # User profile
│   │   └── RegisterPage.jsx       # Registration form
│   │
│   ├── services/
│   │   └── ai.js                  # API service layer
│   │
│   ├── App.jsx                    # Main app with routing
│   └── index.jsx                  # Entry point
│
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind config
└── vite.config.js                 # Vite config
```

---

## 🎯 Milestone 1 - Team Contributions

### SARVATHA R
- ✅ Project initialization (React 18 + Vite + Tailwind CSS)
- ✅ LoginPage component with responsive design
- ✅ Login mockup and actual implementation
- ✅ Form validation and authentication UI/UX

### Abhay Tripathi
- ✅ RegisterPage component with responsive design
- ✅ Registration mockup and actual implementation
- ✅ Password strength indicator
- ✅ Form validation and user type selection

### Aarthi
- ✅ DashboardHome & ProfilePage (mockup and actual)
- ✅ PatentsPage with search and filter
- ✅ Backend integration setup (API services)
- ✅ Mock data implementation

### Shared Components
- ✅ DashboardLayout, AuthLayout, LandingPage
- ✅ App routing and documentation

---

## ✅ Features Implemented

- ✅ Authentication system (Login/Register)
- ✅ Dashboard with stats and analytics
- ✅ Patent portfolio management
- ✅ User profile management
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Backend integration ready

---

## 🌐 Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Home page with features |
| `/login` | LoginPage | User authentication |
| `/register` | RegisterPage | New user registration |
| `/dashboard` | DashboardHome | Main dashboard view |
| `/patents` | PatentsPage | Patent management |
| `/profile` | ProfilePage | User profile editor |

---

## 🔐 Security Note

This project uses an API Key. **Never commit your `.env` file to GitHub.** The `.gitignore` file included in this repository prevents this by default.

---

## 📡 API Integration Status

**Current Mode:** Mock Data

All API calls in `src/services/ai.js` are currently mocked for development. To connect to the real backend:

1. Update `.env` with backend URL
2. Uncomment real API calls in `services/ai.js`
3. Comment out mock implementations

---

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

---

## 📊 Development Status

**Frontend:** ✅ 100% Complete  
**Ready for Backend Integration:** ✅ Yes  
**Last Updated:** December 10, 2025

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

## 🤝 Contributing

Ensure all commits follow proper conventions and include co-author attribution for collaborative work.

---

**Status:** Frontend 100% Complete  
**Tech Stack:** React 18, Vite, Tailwind CSS, Lucide React