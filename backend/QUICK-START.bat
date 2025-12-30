@echo off
REM Quick Setup Script for Admin Login

echo.
echo ========================================
echo   ADMIN LOGIN - QUICK SETUP
echo ========================================
echo.
echo This script will:
echo  1. Insert admin user into database
echo  2. Start the backend server
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Step 1: Inserting admin user...
echo ----------------------------------------

set PGPASSWORD=admin
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d my_project_db -c "DELETE FROM admin_users WHERE admin_id = 1;"
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d my_project_db -c "INSERT INTO admin_users (admin_id, admin_name, email, password, created_at, updated_at) VALUES (1, 'Vikas', 'vikaskumaryadav068@gmail.com', 'admin123', NOW(), NOW());"

echo.
echo Step 2: Verifying admin user...
echo ----------------------------------------
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d my_project_db -c "SELECT admin_id, admin_name, email FROM admin_users WHERE admin_id = 1;"

echo.
echo ========================================
echo   ADMIN CREDENTIALS:
echo ========================================
echo   Admin ID:  1
echo   Name:      Vikas
echo   Email:     vikaskumaryadav068@gmail.com
echo   Password:  admin123
echo ========================================
echo.
echo.
echo Step 3: Starting backend server...
echo ----------------------------------------
echo.

cd backend
mvn spring-boot:run
