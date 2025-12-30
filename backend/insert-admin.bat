@echo off
echo =====================================
echo   Inserting Admin User
echo =====================================
echo.

set PGPASSWORD=admin
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d my_project_db -f insert-admin-user.sql

echo.
echo =====================================
echo   Admin Credentials:
echo   Admin ID: 1
echo   Name: Vikas
echo   Email: vikaskumaryadav068@gmail.com
echo   Password: admin123
echo =====================================
echo.
pause
