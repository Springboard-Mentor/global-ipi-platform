# Contact & Feedback Forms - Setup Guide

## Overview
Contact aur Feedback forms ab local database mein data store karte hain aur users ko email bhi send karte hain.

## Database Tables Created

### 1. Contacts Table
- **id** (Primary Key)
- **name** (User ka naam)
- **email** (User ka email)
- **phone** (Phone number - optional)
- **subject** (Message ka subject)
- **message** (User ka message)
- **created_at** (Submission time)
- **email_sent** (Email send hua ya nahi)

### 2. Feedbacks Table
- **id** (Primary Key)
- **user_name** (User ka naam)
- **user_email** (User ka email)
- **user_id** (Firebase UID)
- **ui_rating** (User Interface rating 0-5)
- **performance_rating** (Performance rating 0-5)
- **features_rating** (Features rating 0-5)
- **support_rating** (Support rating 0-5)
- **overall_rating** (Overall rating 0-5)
- **average_rating** (Average of all ratings)
- **feedback_message** (Additional comments)
- **created_at** (Submission time)
- **email_sent** (Email send hua ya nahi)

## Email Configuration Setup

### Step 1: Gmail App Password Generate Karo

1. **Google Account Settings** mein jao: https://myaccount.google.com/
2. **Security** section mein jao
3. **2-Step Verification** enable karo (agar already nahi hai)
4. **App Passwords** search karo
5. **Select app**: Other (Custom name)
6. **Name**: "Global IPI Platform"
7. **Generate** button click karo
8. **16-digit password** copy karo

### Step 2: Application.properties Update Karo

File: `backend/backend/src/main/resources/application.properties`

```properties
# Replace YOUR_APP_PASSWORD_HERE with the generated app password
spring.mail.password=YOUR_16_DIGIT_APP_PASSWORD_HERE
```

**Important**: 16-digit app password ko spaces ke bina paste karo!

## Backend APIs

### Contact Form API
- **Endpoint**: `POST http://localhost:8080/api/contact/submit`
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "This is my message"
}
```

- **Response**:
```json
{
  "success": true,
  "message": "Thank you for contacting us! We'll get back to you soon.",
  "contactId": 1
}
```

### Feedback Form API
- **Endpoint**: `POST http://localhost:8080/api/feedback/submit`
- **Request Body**:
```json
{
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userId": "firebase-uid-123",
  "userInterfaceRating": 5,
  "performanceRating": 4,
  "featuresRating": 5,
  "supportRating": 4,
  "overallRating": 5,
  "feedbackMessage": "Great platform!"
}
```

- **Response**:
```json
{
  "success": true,
  "message": "Thank you for your feedback! We appreciate your input.",
  "feedbackId": 1,
  "averageRating": 4.6
}
```

## Additional Admin APIs

### Get All Contacts
```
GET http://localhost:8080/api/contact/all
```

### Get Contact by ID
```
GET http://localhost:8080/api/contact/{id}
```

### Delete Contact
```
DELETE http://localhost:8080/api/contact/{id}
```

### Get All Feedbacks
```
GET http://localhost:8080/api/feedback/all
```

### Get Feedback by User ID
```
GET http://localhost:8080/api/feedback/user/{userId}
```

### Get Feedback Statistics
```
GET http://localhost:8080/api/feedback/stats
```

Returns:
```json
{
  "totalFeedbacks": 10,
  "averageUIRating": 4.5,
  "averagePerformanceRating": 4.2,
  "averageFeaturesRating": 4.7,
  "averageSupportRating": 4.3,
  "averageOverallRating": 4.6,
  "overallAverageRating": 4.46
}
```

## How It Works

### Contact Form Flow:
1. User form fill karta hai aur submit karta hai
2. Frontend data backend API ko send karta hai (`POST /api/contact/submit`)
3. Backend data PostgreSQL database mein save karta hai
4. Backend 2 emails send karta hai:
   - **User ko**: Confirmation email (thank you message)
   - **Admin ko**: Notification email (new contact details ke saath)
5. Database mein `email_sent` flag update ho jata hai
6. Frontend success message show karta hai

### Feedback Form Flow:
1. User ratings deta hai aur feedback submit karta hai
2. Frontend data backend API ko send karta hai (`POST /api/feedback/submit`)
3. Backend automatically average rating calculate karta hai
4. Data PostgreSQL database mein save hota hai
5. Backend 2 emails send karta hai:
   - **User ko**: Thank you email with rating summary
   - **Admin ko**: Detailed feedback notification
6. Database mein `email_sent` flag update ho jata hai
7. Frontend success message show karta hai

## Email Templates

### Contact Confirmation Email (User Ko)
- Beautiful HTML email
- User ke message details included
- Professional design with gradient header

### Contact Notification Email (Admin Ko)
- All contact details
- User information
- Message content
- Timestamp

### Feedback Confirmation Email (User Ko)
- Thank you message
- Star rating display
- Average rating shown

### Feedback Notification Email (Admin Ko)
- User details
- All 5 ratings displayed in grid
- Average rating
- Additional comments
- Timestamp

## Testing Steps

### 1. Backend Setup
```bash
cd backend/backend
mvn clean install
mvn spring-boot:run
```

Backend should start on `http://localhost:8080`

### 2. Database Check
PostgreSQL database mein automatically 2 tables create ho jayenge:
- `contacts`
- `feedbacks`

### 3. Frontend Setup
```bash
cd frontend/dashboard
npm install
npm run dev
```

### 4. Test Contact Form
1. Dashboard open karo
2. Contact form open karo
3. Details fill karo aur submit karo
4. Success message dekhna chahiye
5. Email check karo (user aur admin dono ko)
6. Database mein entry check karo

### 5. Test Feedback Form
1. Dashboard open karo
2. Feedback form open karo
3. Ratings do aur submit karo
4. Success message dekhna chahiye
5. Email check karo
6. Database mein entry check karo

## Troubleshooting

### Email Not Sending?
1. Check if Gmail app password correct hai
2. Check if 2-Step Verification enabled hai
3. Check backend logs for error messages
4. Verify `spring.mail.username` correct email hai

### Database Error?
1. Check if PostgreSQL running hai
2. Verify database credentials in `application.properties`
3. Check if database `my_project_db` exist karta hai

### API Not Working?
1. Check if backend running hai on port 8080
2. Check CORS configuration (already enabled for all origins)
3. Check browser console for errors
4. Verify API URL: `http://localhost:8080`

## Security Notes

⚠️ **Important**:
- Never commit `application.properties` with real password
- Use environment variables for production
- Enable rate limiting for APIs in production
- Add authentication for admin APIs

## Next Steps (Optional Enhancements)

1. **Admin Dashboard**: Create separate admin panel to view all contacts and feedbacks
2. **Email Queue**: Implement async email sending with retry logic
3. **Attachments**: Allow users to attach files in contact form
4. **Analytics**: Add charts and graphs for feedback statistics
5. **Export**: Add CSV/Excel export functionality for admin
6. **Search & Filter**: Add search and filter options in admin panel

---

## Summary

✅ Contact form data PostgreSQL database mein store hota hai
✅ Feedback form data PostgreSQL database mein store hota hai
✅ User ko confirmation email milta hai
✅ Admin ko notification email milta hai
✅ Beautiful HTML email templates
✅ Proper error handling
✅ All APIs working with proper responses

**Bas Gmail App Password setup karo aur test karo!** 🚀
