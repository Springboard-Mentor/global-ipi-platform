# 🚀 Quick Start Guide - Contact & Feedback Forms

## Step-by-Step Setup (Hindi/English)

### 1️⃣ Gmail App Password Setup Karo

**Sabse pehle ye karo:**

1. https://myaccount.google.com/ pe jao
2. **Security** → **2-Step Verification** enable karo
3. **App Passwords** search karo
4. App select karo: **"Other (Custom name)"**
5. Name likho: **"Global IPI Platform"**
6. **Generate** button click karo
7. **16-digit password copy karo** (e.g., `abcd efgh ijkl mnop`)

### 2️⃣ Application.properties Update Karo

File location: `backend/backend/src/main/resources/application.properties`

**Line 20 ko update karo:**
```properties
spring.mail.password=YOUR_16_DIGIT_APP_PASSWORD
```

**Example:**
```properties
spring.mail.password=abcdefghijklmnop
```

⚠️ **Note**: Spaces mat dalo password mein!

### 3️⃣ Backend Start Karo

```powershell
# Backend folder mein jao
cd backend/backend

# Dependencies install karo (first time only)
mvn clean install

# Backend start karo
mvn spring-boot:run
```

**✅ Success Message:**
```
Started BackendApplication in X.XX seconds
```

Backend ab running hai: **http://localhost:8080**

### 4️⃣ Database Tables Check Karo (Automatic)

Tables automatically create ho jayenge jab backend start hoga:
- ✅ `contacts` table
- ✅ `feedbacks` table

**Manual check karne ke liye:**
```sql
-- PostgreSQL mein run karo
SELECT * FROM contacts;
SELECT * FROM feedbacks;
```

### 5️⃣ Frontend Start Karo

```powershell
# Dashboard folder mein jao
cd frontend/dashboard

# Dependencies install karo (first time only)
npm install

# Frontend start karo
npm run dev
```

**✅ Success Message:**
```
Local: http://localhost:5173/
```

### 6️⃣ Test Karo

#### Contact Form Test:
1. Browser mein dashboard open karo
2. **Contact** button click karo
3. Form fill karo:
   - Name: Your Name
   - Email: your.email@gmail.com
   - Phone: +91-1234567890
   - Subject: Testing
   - Message: This is a test message
4. **Send Message** click karo
5. ✅ "Message Sent!" dikhai dega
6. **Check your email** - 2 emails aaye honge:
   - User email (confirmation)
   - Admin email (notification)

#### Feedback Form Test:
1. **Feedback** button click karo
2. Star ratings do (1-5 stars each category)
3. Optional message likho
4. **Submit Feedback** click karo
5. ✅ "Thank You!" dikhai dega
6. **Check your email** - 2 emails aaye honge

### 7️⃣ Database Mein Data Check Karo

```sql
-- Latest contacts dekhne ke liye
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10;

-- Latest feedbacks dekhne ke liye
SELECT * FROM feedbacks ORDER BY created_at DESC LIMIT 10;

-- Feedback statistics
SELECT 
    COUNT(*) as total_feedbacks,
    AVG(average_rating) as avg_rating
FROM feedbacks;
```

---

## 📊 API Endpoints (Backend)

### Contact APIs
```
POST   http://localhost:8080/api/contact/submit      # Submit contact form
GET    http://localhost:8080/api/contact/all         # Get all contacts
GET    http://localhost:8080/api/contact/{id}        # Get contact by ID
DELETE http://localhost:8080/api/contact/{id}        # Delete contact
```

### Feedback APIs
```
POST   http://localhost:8080/api/feedback/submit         # Submit feedback
GET    http://localhost:8080/api/feedback/all           # Get all feedbacks
GET    http://localhost:8080/api/feedback/{id}          # Get feedback by ID
GET    http://localhost:8080/api/feedback/user/{userId} # Get user feedbacks
GET    http://localhost:8080/api/feedback/stats         # Get statistics
DELETE http://localhost:8080/api/feedback/{id}          # Delete feedback
```

---

## 🧪 Test API Using curl/PowerShell

### Contact Form Submit:
```powershell
curl -X POST http://localhost:8080/api/contact/submit `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91-1234567890",
    "subject": "API Test",
    "message": "Testing contact form API"
  }'
```

### Feedback Submit:
```powershell
curl -X POST http://localhost:8080/api/feedback/submit `
  -H "Content-Type: application/json" `
  -d '{
    "userName": "Test User",
    "userEmail": "test@example.com",
    "userId": "test-123",
    "userInterfaceRating": 5,
    "performanceRating": 4,
    "featuresRating": 5,
    "supportRating": 4,
    "overallRating": 5,
    "feedbackMessage": "Great platform!"
  }'
```

---

## 🔍 Troubleshooting

### ❌ Email not sending?
**Solution:**
1. Check Gmail app password correct hai ya nahi
2. `application.properties` mein password without spaces hai
3. Gmail account mein 2-Step Verification enabled hai
4. Backend logs check karo: Look for "MessagingException"

### ❌ Database error?
**Solution:**
1. PostgreSQL running hai: `pg_ctl status`
2. Database exists: `SELECT datname FROM pg_database;`
3. Credentials correct hain in `application.properties`
4. Port 5432 available hai

### ❌ Backend not starting?
**Solution:**
1. Java 17+ installed hai: `java -version`
2. Maven installed hai: `mvn -version`
3. Port 8080 free hai: `netstat -ano | findstr :8080`
4. PostgreSQL running hai

### ❌ Frontend API call failing?
**Solution:**
1. Backend running hai on port 8080
2. Browser console check karo for CORS errors
3. API URL correct hai: `http://localhost:8080`
4. Network tab mein request/response dekho

---

## 📧 Email Examples

### User Contact Confirmation Email:
```
Subject: Thank you for contacting us - [Subject]

Dear [User Name],

We have received your message and appreciate you taking the time to reach out to us.

Your Message Details:
Subject: [Subject]
Message: [Message]

Our team will review your message and get back to you as soon as possible.

Best regards,
Global IPI Platform Team
```

### Admin Contact Notification:
```
Subject: New Contact Form Submission - [Subject]

🔔 New Contact Form Submission

Name: [Name]
Email: [Email]
Phone: [Phone]
Subject: [Subject]

Message:
[Message]

Submitted at: [Timestamp]
```

### User Feedback Confirmation:
```
Subject: Thank you for your valuable feedback!

Dear [User Name],

Thank you for your feedback! ⭐

Your Average Rating: ⭐⭐⭐⭐⭐ (4.6 out of 5.0)

Your insights help us improve our platform and provide better service.

Best regards,
Global IPI Platform Team
```

---

## ✅ Final Checklist

- [ ] Gmail App Password generated aur copied
- [ ] `application.properties` mein password updated
- [ ] PostgreSQL database running
- [ ] Backend started successfully (port 8080)
- [ ] Frontend started successfully (port 5173)
- [ ] Contact form test successful
- [ ] Feedback form test successful
- [ ] User emails received
- [ ] Admin emails received
- [ ] Database entries verified

---

## 🎉 Success!

Agar sab steps complete hain to:

✅ Contact form → Database mein save + Emails send
✅ Feedback form → Database mein save + Emails send
✅ Professional HTML emails
✅ All APIs working
✅ Data persistence in PostgreSQL

**Happy Coding! 🚀**

---

## 📞 Need Help?

Check these files for detailed information:
1. **CONTACT_FEEDBACK_SETUP.md** - Complete documentation
2. **create-contact-feedback-tables.sql** - Database schema
3. Backend logs: Check terminal where `mvn spring-boot:run` is running
4. Frontend logs: Check browser console (F12)
