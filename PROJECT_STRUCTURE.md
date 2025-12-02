# Proje Yapısı

## 📁 Klasör Organizasyonu

```
.
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/pazar/backend/
│   │               ├── controller/      # REST Controllers
│   │               │   ├── AuthController.java
│   │               │   ├── HealthController.java
│   │               │   ├── MarketController.java
│   │               │   └── ProductController.java
│   │               ├── config/           # Configuration
│   │               │   └── OpenApiConfig.java
│   │               └── PazarBackendApplication.java
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                   # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/        # React Components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── search/        # Search components
│   │   │   ├── products/      # Product components
│   │   │   └── maps/          # Map components (2D/3D)
│   │   ├── services/          # API Services
│   │   ├── types/             # TypeScript Types
│   │   ├── utils/             # Utility Functions
│   │   └── constants/         # Constants
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.ts
│
├── docker/                     # Docker configurations (optional)
│
├── docs/                       # Documentation
│   ├── README.md
│   └── swagger.yaml
│
├── docker-compose.yml          # Docker Compose configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # Main README
```

## 🎯 Klasör Açıklamaları

### backend/
Tüm Spring Boot backend kodları burada:
- **src/main/java/**: Java kaynak kodları
- **pom.xml**: Maven bağımlılıkları
- **Dockerfile**: Backend için Docker imajı

### frontend/
React + TypeScript frontend uygulaması:
- **src/components/**: React component'leri (organize edilmiş)
- **src/services/**: API çağrıları
- **src/types/**: TypeScript type tanımları
- **src/utils/**: Yardımcı fonksiyonlar
- **src/constants/**: Sabitler

### docker/
Docker yapılandırma dosyaları (opsiyonel)

### docs/
Proje dokümantasyonu:
- API dokümantasyonu (Swagger)
- Ek README dosyaları

## 🚀 Kullanım

```bash
# Docker ile çalıştırma
docker-compose up -d

# Backend: http://localhost:8080
# Frontend: http://localhost:3000
```

