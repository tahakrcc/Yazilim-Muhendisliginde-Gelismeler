@echo off
echo ========================================
echo Pazar Yonetim Sistemi - Manuel Baslatma
echo ========================================
echo.

echo [1/2] Backend baslatiliyor...
start "Backend Server" cmd /k "cd backend && .\mvnw.cmd spring-boot:run"

timeout /t 5 /nobreak >nul

echo [2/2] Frontend baslatiliyor...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servisler baslatildi!
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo Swagger: http://localhost:8080/swagger-ui.html
echo.
echo Servisleri durdurmak icin pencereyi kapatin.
echo ========================================
pause

