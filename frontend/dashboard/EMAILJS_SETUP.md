# EmailJS Setup Guide for Contact & Feedback Forms

This guide will help you configure EmailJS to enable email functionality for the Contact and Feedback forms.

## 📧 What is EmailJS?

EmailJS allows you to send emails directly from JavaScript without server-side code. All emails will be sent to: **vikaskumaryadav068@gmail.com**

## 🚀 Setup Instructions

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service

1. In EmailJS dashboard, click "Add New Service"
2. Choose your email provider (Gmail recommended):
   - Select "Gmail"
   - Click "Connect Account"
   - Authorize with **vikaskumaryadav068@gmail.com**
3. Name your service (e.g., "IP Platform Gmail")
4. Copy the **Service ID** (looks like `service_xxxxxxx`)

### Step 3: Create Email Templates

#### Contact Form Template

1. Click "Email Templates" → "Create New Template"
2. Template Name: **Contact Form Submission**
3. Template Content:
```
Subject: New Contact Form Submission - {{subject}}

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the Global IP Platform Contact Form.
```

4. Template Variables to use:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{phone}}`
   - `{{subject}}`
   - `{{message}}`
   - `{{to_email}}` (pre-filled: vikaskumaryadav068@gmail.com)

5. Copy the **Template ID** (looks like `template_xxxxxxx`)

#### Feedback Form Template

1. Click "Email Templates" → "Create New Template"
2. Template Name: **User Feedback Submission**
3. Template Content:
```
Subject: User Feedback Received - {{user_name}}

From: {{user_name}}
Email: {{user_email}}
User ID: {{user_id}}

RATINGS:
━━━━━━━━━━━━━━━━━━━━
• UI & Design: {{ui_rating}}/5 ⭐
• Performance: {{performance_rating}}/5 ⭐
• Features: {{features_rating}}/5 ⭐
• Support: {{support_rating}}/5 ⭐
• Overall Experience: {{overall_rating}}/5 ⭐

Average Rating: {{average_rating}}/5.0

FEEDBACK MESSAGE:
{{feedback_message}}

---
This feedback was submitted from the Global IP Platform.
```

4. Template Variables to use:
   - `{{user_name}}`
   - `{{user_email}}`
   - `{{user_id}}`
   - `{{ui_rating}}`
   - `{{performance_rating}}`
   - `{{features_rating}}`
   - `{{support_rating}}`
   - `{{overall_rating}}`
   - `{{average_rating}}`
   - `{{feedback_message}}`
   - `{{to_email}}`

5. Copy the **Template ID**

### Step 4: Get Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (looks like a random string)
3. Copy it

### Step 5: Update Code Files

#### Update ContactForm.jsx

File: `src/components/ContactForm.jsx`

Replace these lines (around line 23-25):
```javascript
const serviceId = "service_9h3j8kl"; // Replace with your EmailJS service ID
const templateId = "template_contact"; // Replace with your EmailJS template ID
const publicKey = "YOUR_PUBLIC_KEY"; // Replace with your EmailJS public key
```

With your actual values:
```javascript
const serviceId = "service_YOUR_SERVICE_ID";
const templateId = "template_YOUR_CONTACT_TEMPLATE_ID";
const publicKey = "YOUR_ACTUAL_PUBLIC_KEY";
```

#### Update FeedbackForm.jsx

File: `src/components/FeedbackForm.jsx`

Replace these lines (around line 56-58):
```javascript
const serviceId = "service_9h3j8kl"; // Replace with your EmailJS service ID
const templateId = "template_feedback"; // Replace with your EmailJS template ID
const publicKey = "YOUR_PUBLIC_KEY"; // Replace with your EmailJS public key
```

With your actual values:
```javascript
const serviceId = "service_YOUR_SERVICE_ID";
const templateId = "template_YOUR_FEEDBACK_TEMPLATE_ID";
const publicKey = "YOUR_ACTUAL_PUBLIC_KEY";
```

## 📝 Example Configuration

```javascript
// Example values (these are NOT real - use your own!)
const serviceId = "service_abc123";
const templateId = "template_xyz789";
const publicKey = "mQp9K_xYz123AbC";
```

## ✅ Testing

1. After updating the code, restart your development server
2. Go to the Contact page and submit a test message
3. Check **vikaskumaryadav068@gmail.com** for the email
4. Go to the Feedback page and submit test feedback
5. Verify the feedback email is received

## 🔒 Security Notes

- EmailJS Public Key is safe to use in frontend code
- Your email credentials are NOT exposed
- Free tier allows 200 emails/month
- Consider upgrading if you need more

## 🆘 Troubleshooting

**Emails not sending?**
- Check browser console for errors
- Verify all IDs are correct
- Make sure you authorized the Gmail account
- Check EmailJS dashboard for failed sends

**Rate Limited?**
- EmailJS free tier: 200 emails/month
- Upgrade to paid plan if needed

## 📚 Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Templates Guide](https://www.emailjs.com/docs/user-guide/creating-email-template/)
- [EmailJS Pricing](https://www.emailjs.com/pricing/)

## 🎯 Current Status

✅ EmailJS package installed  
✅ Contact form created with email integration  
✅ Feedback form created with star ratings  
⏳ Awaiting EmailJS credentials configuration  

**Next Step:** Follow the setup instructions above to get your EmailJS credentials and update the code!
