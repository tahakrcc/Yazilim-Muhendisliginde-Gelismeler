#!/bin/bash

echo "========================================"
echo "Pazar Yonetim Sistemi - Manuel Baslatma"
echo "========================================"
echo ""

echo "[1/2] Backend baslatiliyor..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

sleep 5

echo "[2/2] Frontend baslatiliyor..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Servisler baslatildi!"
echo ""
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo "Swagger: http://localhost:8080/swagger-ui.html"
echo ""
echo "Servisleri durdurmak icin Ctrl+C basin"
echo "========================================"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

