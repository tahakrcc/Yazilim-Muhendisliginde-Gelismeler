# Pazar Backend - Spring Boot API

Backend API servisi için Spring Boot uygulaması.

## 📁 Proje Yapısı

```
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/pazar/backend/
│       │       ├── PazarBackendApplication.java
│       │       ├── config/          # Yapılandırma sınıfları
│       │       │   ├── OpenApiConfig.java
│       │       │   └── SecurityConfig.java
│       │       ├── controller/      # REST Controller'lar
│       │       │   ├── AuthController.java
│       │       │   ├── HealthController.java
│       │       │   ├── MarketController.java
│       │       │   └── ProductController.java
│       │       ├── service/         # İş mantığı servisleri
│       │       │   ├── MarketService.java
│       │       │   └── ProductService.java
│       │       └── entity/          # Entity sınıfları
│       │           ├── Market.java
│       │           └── Product.java
│       └── resources/
│           └── application.properties
├── pom.xml
├── Dockerfile
└── README.md
```

## 🚀 Özellikler

- ✅ RESTful API
- ✅ Swagger/OpenAPI dokümantasyonu
- ✅ CORS yapılandırması
- ✅ Security yapılandırması
- ✅ Service katmanı mimarisi
- ✅ Entity katmanı
- ✅ Health check endpoint

## 📝 API Endpoints

### Health
- `GET /api/health` - Sistem durumu

### Products
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/search?query={query}&marketId={id}` - Ürün ara
- `GET /api/products/{id}/prices?marketId={id}` - Ürün fiyatları
- `GET /api/products/{id}/cheapest?marketId={id}` - En ucuz ürün
- `GET /api/products/category/{category}` - Kategoriye göre ürünler

### Markets
- `GET /api/markets` - Tüm pazarları listele
- `GET /api/markets/{id}` - Pazar detayları
- `GET /api/markets/{id}/map` - Pazar haritası
- `GET /api/markets/{id}/route/{stallNumber}` - Tezgah yolu

### Auth
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı

## 🛠️ Teknolojiler

- Spring Boot 3.2.0
- Java 17
- Maven
- Spring Security
- SpringDoc OpenAPI (Swagger)

## 🐳 Docker

```bash
docker build -t pazar-backend .
docker run -p 8080:8080 pazar-backend
```

## 📚 API Dokümantasyonu

Swagger UI: http://localhost:8080/swagger-ui.html

