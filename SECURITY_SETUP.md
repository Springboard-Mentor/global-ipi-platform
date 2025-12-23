# 🔐 Security Setup Guide - Global IP Intelligence Platform

## ⚠️ IMPORTANT: Protecting Sensitive Information

This project uses environment variables to protect sensitive information like API keys, database passwords, and Firebase configuration. **Never commit actual API keys or passwords to Git.**

## 📋 Setup Instructions

### 1. Backend Configuration (Spring Boot)

**File**: `backend/backend/src/main/resources/application-secrets.properties`

1. Copy the template file:
   ```bash
   cd backend/backend/src/main/resources
   cp application-secrets.properties.template application-secrets.properties
   ```

2. Edit `application-secrets.properties` and replace placeholders with actual values:
   ```properties
   # Database password
   db.password=YOUR_ACTUAL_DATABASE_PASSWORD

   # SerpAPI key (get from https://serpapi.com/)
   serpapi.key=YOUR_ACTUAL_SERPAPI_KEY

   # Email configuration for notifications
   mail.username=YOUR_EMAIL@gmail.com
   mail.password=YOUR_EMAIL_APP_PASSWORD

   # Admin email for system notifications
   admin.email=YOUR_ADMIN_EMAIL@gmail.com
   ```

### 2. Frontend Dashboard Configuration (Vite)

**File**: `frontend/dashboard/.env`

1. Copy the template file:
   ```bash
   cd frontend/dashboard
   cp .env.template .env
   ```

2. Edit `.env` and add your Firebase configuration (uses `VITE_` prefix):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 3. Frontend Login/Signup Configuration (Create React App)

**File**: `frontend/.env`

1. Copy the template file:
   ```bash
   cd frontend
   cp .env.template .env
   ```

2. Edit `.env` and add your Firebase configuration (uses `REACT_APP_` prefix):
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

## 🔑 Where to Get Your Keys

### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new one)
3. Click ⚙️ (Settings) → Project settings
4. Scroll down to "Your apps" section
5. Copy the configuration values

### SerpAPI Key
1. Sign up at [SerpAPI](https://serpapi.com/)
2. Go to Dashboard → API Key
3. Copy your API key

### PostgreSQL Database
- Use your local PostgreSQL password
- Default: `Postgres@123` (change for production!)

### Gmail App Password (for email notifications)
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create a new app password
4. Use this password in `mail.password`


## 🚀 After Configuration

### Restart Servers to Load Environment Variables

**Backend:**
```bash
cd backend/backend
# Stop if running (Ctrl+C), then:
./mvnw spring-boot:run
```

**Dashboard:**
```bash
cd frontend/dashboard
# Stop if running (Ctrl+C), then:
npm run dev
```

**Login/Signup:**
```bash
cd frontend
# Stop if running (Ctrl+C), then:
npm start
```

## ✅ Verify Configuration

### Check Backend:
```bash
# Backend should start without errors on http://localhost:8080
curl http://localhost:8080/api/patents/search?query=test
```

### Check Frontend:
- Dashboard: http://localhost:5173/
- Login: http://localhost:3000/
- Open browser console and verify no Firebase errors

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` and `application-secrets.properties` files **out of Git**
- Use different API keys for development and production
- Share only `.template` files with team members
- Rotate keys periodically
- Use strong database passwords

### ❌ DON'T:
- Commit `.env` or `application-secrets.properties` to Git
- Share API keys in Slack, email, or screenshots
- Use production keys in development
- Hardcode secrets in source code
- Push secrets to public repositories

## 🆘 What If Secrets Are Accidentally Committed?

### If you committed secrets to Git:

1. **Immediately rotate all exposed keys:**
   - Firebase: Regenerate API keys in Firebase Console
   - SerpAPI: Generate new API key
   - Database: Change password
   - Email: Generate new app password

2. **Remove from Git history:**
   ```bash
   # Remove file from Git history (use with caution!)
   git filter-branch --index-filter "git rm -rf --cached --ignore-unmatch path/to/secret/file" HEAD
   ```

3. **Force push (if you have permission):**
   ```bash
   git push origin --force --all
   ```

4. **Notify your team** to pull fresh code and update their keys

## 📚 Environment Variable Naming Conventions

### Backend (Spring Boot)
- Uses `${variable.name}` syntax in `application.properties`
- Actual values in `application-secrets.properties`
- Example: `spring.datasource.password=${db.password}`

### Dashboard (Vite)
- Uses `VITE_` prefix (required by Vite)
- Access in code: `import.meta.env.VITE_VARIABLE_NAME`
- Example: `import.meta.env.VITE_FIREBASE_API_KEY`

### Login/Signup (Create React App)
- Uses `REACT_APP_` prefix (required by CRA)
- Access in code: `process.env.REACT_APP_VARIABLE_NAME`
- Example: `process.env.REACT_APP_FIREBASE_API_KEY`

## 📞 Need Help?

If you encounter issues:
1. Verify all `.env` files are created from templates
2. Check that environment variable names match exactly
3. Restart development servers after changing `.env` files
4. Check browser console for Firebase errors
5. Verify backend logs for database connection errors

## 🎯 Quick Checklist for New Team Members

- [ ] Copy `backend/backend/src/main/resources/application-secrets.properties.template` to `application-secrets.properties`
- [ ] Copy `frontend/dashboard/.env.template` to `.env`
- [ ] Copy `frontend/.env.template` to `.env`
- [ ] Fill in all actual values (Firebase, SerpAPI, Database, Email)
- [ ] Verify `.gitignore` excludes `.env` and `application-secrets.properties`
- [ ] Restart all servers
- [ ] Test login, search, and database connectivity
- [ ] **Never commit `.env` or `application-secrets.properties` files!**

---

**Remember**: Security is everyone's responsibility! 🔐

---

## 🔍 Enhanced Security Features

1. **API Key Hidden in Logs**:
   ```java
   logger.info("URL: {}", url.replaceAll("api_key=[^&]*", "api_key=***HIDDEN***"));
   ```

2. **Centralized Configuration**:
   - All sensitive data in one place
   - Easy to manage across environments

3. **Template for Sharing**:
   - Team members know what to configure
   - No actual secrets in the template

---

## 🎯 Current Configuration

Your `application.properties` contains:

```properties
# Database
spring.datasource.password=Postgres@123  ← Change this!

# API Keys
serpapi.key=911c64...  ← This is now safe from Git
```

**Recommendation**: Change your database password too since it was also hardcoded!

---

## 📝 Summary

✅ API keys moved to configuration file  
✅ Configuration file added to .gitignore  
✅ Template created for team sharing  
✅ Code updated to use injected values  
✅ Logs hide sensitive information  

Your API keys are now **SAFE**! 🎉
