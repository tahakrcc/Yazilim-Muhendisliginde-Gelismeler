# Pazar Yönetim Sistemi

Yapay Zeka Destekli Ürün Arama ve 3D Konum Yönlendirme Sistemi

## 📁 Proje Yapısı

```
.
├── backend/          # Spring Boot Backend (Java)
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/pazar/backend/
│   │               ├── controller/    # REST Controllers
│   │               ├── config/        # Configuration
│   │               └── PazarBackendApplication.java
│   └── pom.xml
├── frontend/         # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   └── constants/    # Constants
│   └── package.json
├── docker/           # Docker yapılandırmaları
│   ├── docker-compose.yml
│   └── Dockerfile (backend için)
└── docs/             # Dokümantasyon
    ├── README.md
    └── swagger.yaml
```

## 🚀 Hızlı Başlangıç

### Docker ile Çalıştırma

```bash
cd docker
docker-compose up -d
```

- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8080/swagger-ui.html

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

Detaylı API dokümantasyonu için: `docs/swagger.yaml`
