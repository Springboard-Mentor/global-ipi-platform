@echo off
echo ====================================
echo Starting Backend Server for Admin
echo ====================================
echo.
echo Compiling backend...
cd /d "%~dp0backend"
call mvn clean package -DskipTests
echo.
echo Starting Spring Boot application...
call mvn spring-boot:run
