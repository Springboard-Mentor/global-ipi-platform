# 🔐 Security Configuration Guide

## Overview

This project uses **external configuration files** to store sensitive data like passwords, API keys, and credentials. These files are **excluded from Git** to prevent accidental exposure of secrets.

## Configuration Structure

### 📁 Configuration Files

```
backend/backend/src/main/resources/
├── application.properties              # Main config (uses references) ✅ Safe to commit
├── application.properties.template     # Template with placeholders ✅ Safe to commit
└── application-secrets.properties      # Contains actual secrets ❌ NEVER COMMIT
```

### 🔒 Sensitive Files (Ignored by Git)

The following files contain sensitive data and are **automatically ignored** by `.gitignore`:

- ❌ `application-secrets.properties` - Contains actual passwords and API keys
- ❌ `application.properties` - May contain sensitive data (excluded to be safe)
- ✅ `application.properties.template` - Safe template for reference

## Setup Instructions

### For Development (First Time Setup)

1. **Navigate to resources folder:**
   ```bash
   cd backend/backend/src/main/resources/
   ```

2. **The secrets file already exists** with your actual credentials:
   ```
   application-secrets.properties (already created ✅)
   ```

3. **Verify the configuration:**
   - `application.properties` - Uses property references like `${db.password}`
   - `application-secrets.properties` - Contains actual values

### For Team Members / New Developers

1. **Copy the template:**
   ```bash
   cd backend/backend/src/main/resources/
   cp application.properties.template application-secrets.properties
   ```

2. **Edit `application-secrets.properties`** and add actual values:
   ```properties
   # Database Password
   db.password=YOUR_ACTUAL_DB_PASSWORD

   # SerpAPI Key
   serpapi.key=YOUR_ACTUAL_SERPAPI_KEY

   # Email Configuration
   mail.username=your.email@gmail.com
   mail.password=your_gmail_app_password
   admin.email=admin@example.com
   ```

3. **Never commit this file!** It's already in `.gitignore`

## How It Works

### Property Reference System

**application.properties** (safe, uses references):
```properties
spring.datasource.password=${db.password}
serpapi.key=${serpapi.key}
spring.mail.username=${mail.username}
spring.mail.password=${mail.password}
app.admin.email=${admin.email}

# Import actual values from secrets file
spring.config.import=optional:classpath:application-secrets.properties
```

**application-secrets.properties** (sensitive, not in Git):
```properties
db.password=Postgres@123
serpapi.key=911c64677374efe91d47afc2a41d11c9c175d3140dd130b31ce7bb56010ed8e0
mail.username=vikaskumaryadav068@gmail.com
mail.password=karm fdlu osvr xrnt
admin.email=vikaskumaryadav068@gmail.com
```

### Property Resolution Order

Spring Boot loads properties in this order:
1. `application-secrets.properties` (via `spring.config.import`)
2. `application.properties` (references values from secrets)
3. Environment variables (if set, will override)

## Environment Variables (Alternative)

You can also use **environment variables** instead of `application-secrets.properties`:

### Windows (PowerShell):
```powershell
$env:DB_PASSWORD="Postgres@123"
$env:SERPAPI_KEY="your_key_here"
$env:MAIL_USERNAME="your@email.com"
$env:MAIL_PASSWORD="your_app_password"
$env:ADMIN_EMAIL="admin@email.com"
```

### Linux/Mac (Bash):
```bash
export DB_PASSWORD="Postgres@123"
export SERPAPI_KEY="your_key_here"
export MAIL_USERNAME="your@email.com"
export MAIL_PASSWORD="your_app_password"
export ADMIN_EMAIL="admin@email.com"
```

### Update application.properties to use env vars:
```properties
spring.datasource.password=${DB_PASSWORD:fallback_value}
serpapi.key=${SERPAPI_KEY:fallback_value}
spring.mail.username=${MAIL_USERNAME:fallback_value}
spring.mail.password=${MAIL_PASSWORD:fallback_value}
app.admin.email=${ADMIN_EMAIL:fallback_value}
```

## .gitignore Protection

### Files Excluded from Git:

```gitignore
# Sensitive configuration files
**/application-secrets.properties
**/application.properties
!**/application.properties.template

# API Keys and Secrets
**/*-secrets.*
**/secrets.*
**/*.secret
.credentials/

# Environment variables
.env
.env.local
.env.*.local
```

## Security Best Practices

### ✅ DO:
- ✅ Use `application-secrets.properties` for local development
- ✅ Use environment variables for production/CI/CD
- ✅ Share `application.properties.template` with the team
- ✅ Document required secrets in README
- ✅ Rotate credentials regularly
- ✅ Use different credentials for dev/staging/prod

### ❌ DON'T:
- ❌ Commit `application-secrets.properties` to Git
- ❌ Share secrets via email or chat
- ❌ Hardcode passwords in source code
- ❌ Use production credentials in development
- ❌ Reuse passwords across environments
- ❌ Store secrets in screenshots or documentation

## Verifying Git Exclusion

### Check if files are ignored:
```bash
# Check git status
git status

# Verify file is ignored
git check-ignore -v application-secrets.properties

# Should output:
# .gitignore:XX:**/application-secrets.properties    application-secrets.properties
```

### If accidentally committed:
```bash
# Remove from Git but keep locally
git rm --cached backend/backend/src/main/resources/application-secrets.properties

# Commit the removal
git commit -m "Remove sensitive configuration file"

# Verify it's ignored
git status
```

## Production Deployment

### Recommended: Environment Variables

For production deployments (Docker, Kubernetes, Cloud):

**Docker Compose:**
```yaml
services:
  backend:
    environment:
      - DB_PASSWORD=${DB_PASSWORD}
      - SERPAPI_KEY=${SERPAPI_KEY}
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
```

**Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  db.password: "your_password"
  serpapi.key: "your_key"
  mail.username: "your@email.com"
  mail.password: "your_app_password"
  admin.email: "admin@email.com"
```

**Cloud Platforms:**
- **Heroku**: Use Config Vars
- **AWS**: Use Parameter Store / Secrets Manager
- **Azure**: Use Key Vault
- **GCP**: Use Secret Manager

## Troubleshooting

### Backend won't start - Missing properties

**Error:**
```
Could not resolve placeholder 'db.password' in value "${db.password}"
```

**Solution:**
1. Check if `application-secrets.properties` exists
2. Verify it contains all required properties
3. Check `spring.config.import` is present in `application.properties`

### Git shows secrets file

**If `application-secrets.properties` shows in `git status`:**

```bash
# Add to .gitignore if not already there
echo "**/application-secrets.properties" >> .gitignore

# Remove from staging
git rm --cached backend/backend/src/main/resources/application-secrets.properties

# Commit
git commit -m "Remove secrets from Git tracking"
```

## Summary

🔒 **Current Setup:**
- ✅ Secrets stored in `application-secrets.properties`
- ✅ References used in `application.properties`
- ✅ Files excluded from Git via `.gitignore`
- ✅ Template provided for team members
- ✅ Ready for environment variable override

🎯 **What's Protected:**
- 🔐 Database password
- 🔐 SerpAPI key
- 🔐 Email credentials
- 🔐 Admin email

📚 **Files to Share with Team:**
- ✅ `application.properties.template`
- ✅ This README
- ✅ `.gitignore` (already in Git)

**Your secrets are now secure! 🎉**
