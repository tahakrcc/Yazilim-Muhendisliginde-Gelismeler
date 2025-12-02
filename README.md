# Pazar Yönetim Sistemi

Yapay Zeka Destekli Ürün Arama ve 3D Konum Yönlendirme Sistemi

## 📁 Proje Yapısı

```
.
├── backend/          # Spring Boot Backend (Java)
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/pazar/backend/
│   │       │       ├── config/        # Yapılandırma
│   │       │       ├── controller/    # REST Controllers
│   │       │       ├── service/       # İş mantığı servisleri
│   │       │       └── entity/        # Entity sınıfları
│   │       └── resources/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/         # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   └── constants/    # Constants
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Hızlı Başlangıç

### Docker ile Çalıştırma

```bash
docker-compose up -d
```

**Servisler:**
- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8080/swagger-ui.html

### Manuel Çalıştırma

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## ✨ Özellikler

- 🔍 AI destekli ürün arama
- 💰 Fiyat karşılaştırma
- 🗺️ İnteraktif 2D harita (Konva.js)
- 🌐 3D harita görünümü (React Three Fiber)
- 📍 Tezgah yönlendirme ve navigasyon

## 🛠️ Teknolojiler

**Backend:**
- Spring Boot 3.2.0
- Java 17
- Maven

**Frontend:**
- React 18
- TypeScript
- Vite
- Konva.js (2D Maps)
- React Three Fiber (3D Maps)

## 📝 API Endpoints

- `GET /api/health` - Health check
- `GET /api/products/search` - Ürün arama
- `GET /api/markets` - Pazar listesi
- `POST /api/auth/login` - Kullanıcı girişi

Detaylı API dokümantasyonu: http://localhost:8080/swagger-ui.html
