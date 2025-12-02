# ⚡ Hızlı Başlatma

## Windows için (En Kolay)

**Çift tıklayın:**
```
BASLAT.bat
```

Bu script otomatik olarak:
1. Backend'i başlatır (http://localhost:8080)
2. Frontend'i başlatır (http://localhost:3000)

## Manuel Başlatma

### Backend (Terminal 1)
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

## ✅ Kontrol

- Backend: http://localhost:8080/api/health
- Frontend: http://localhost:3000
- Swagger: http://localhost:8080/swagger-ui.html

## ⚠️ Not

Backend başlarken biraz zaman alabilir (ilk çalıştırmada Maven dependencies indirilir).

