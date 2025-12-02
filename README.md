# 🛒 Pazar Yönetim Sistemi

**Yapay Zeka Destekli Ürün Arama ve 3D Konum Yönlendirme Sistemi**

Pazarlarda satılan ürünlerin fiyat ve konum bilgilerini alan web tabanlı bir sistemdir. Kullanıcılar yapay zeka destekli arama ve filtreleme özellikleri sayesinde en ucuz veya en taze ürünü kolayca bulur. Sistem ürünlerin pazar içindeki tam yerini 2D planlar ve 3D şemalar üzerinde göstererek müşteriyi doğrudan tezgâha yönlendirir.

## 🎯 Proje Özellikleri

- 🔍 **AI Destekli Arama**: Akıllı ürün arama ve öneri sistemi
- 💰 **Fiyat Karşılaştırma**: En ucuz ürünü bulma
- 🗺️ **2D Harita**: İnteraktif 2D harita görünümü (Konva.js)
- 🌐 **3D Harita**: 3D harita görünümü (React Three Fiber)
- 📍 **Tezgah Yönlendirme**: Ürünlerin tam konumunu gösterir
- 🏪 **Çoklu Pazar Desteği**: Birden fazla pazar yönetimi

## 📁 Proje Yapısı

```
.
├── backend/          # Spring Boot Backend (Java 17)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/pazar/backend/
│   │       │   ├── config/        # Yapılandırma
│   │       │   ├── controller/   # REST Controllers
│   │       │   ├── service/       # İş mantığı servisleri
│   │       │   └── entity/        # Entity sınıfları
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/         # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── layout/  # Header, Layout
│   │   │   ├── search/  # SearchPanel
│   │   │   ├── products/# ProductResults
│   │   │   └── maps/    # Map2D, Map3D, MapView
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Utility functions
│   │   └── constants/   # Constants
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── BASLAT.bat        # Windows otomatik başlatma
├── BASLAT.sh         # Linux/Mac otomatik başlatma
└── README.md
```

## 🚀 Hızlı Başlangıç

### Docker ile Çalıştırma (Önerilen)

```bash
docker-compose up -d
```

**Servisler:**
- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8080/swagger-ui.html

### Manuel Çalıştırma

#### Windows (En Kolay)
```bash
BASLAT.bat
```

#### Manuel Başlatma

**Terminal 1 - Backend:**
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Teknolojiler

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Java 17+** - Programlama dili
- **Maven** - Build tool
- **H2 Database** - Embedded database (development)
- **PostgreSQL** - Production database (hazır)
- **Spring Security** - Güvenlik
- **Swagger/OpenAPI** - API dokümantasyonu

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Konva.js** - 2D canvas (harita)
- **React Three Fiber** - 3D rendering
- **Three.js** - 3D grafik kütüphanesi
- **Axios** - HTTP client

## 📝 API Endpoints

- `GET /api/health` - Health check
- `GET /api/products/search?q={query}` - Ürün arama
- `GET /api/markets` - Pazar listesi
- `GET /api/markets/{id}` - Pazar detayı
- `POST /api/auth/login` - Kullanıcı girişi

**Detaylı API Dokümantasyonu:** http://localhost:8080/swagger-ui.html

## 🎨 Özellikler Detayı

### 1. AI Destekli Arama
- Akıllı ürün arama algoritması
- Öneri sistemi
- Benzer ürün önerileri

### 2. Fiyat Karşılaştırma
- En ucuz ürünü bulma
- Fiyat grafikleri
- Tarihsel fiyat takibi

### 3. 2D Harita (Konva.js)
- İnteraktif pazar haritası
- Tezgah konumları
- Ürün yönlendirme

### 4. 3D Harita (R3F)
- 3D pazar görünümü
- İnteraktif navigasyon
- Gerçekçi görselleştirme

## 🔧 Gereksinimler

- **Docker** (Docker Compose için) veya
- **Java 17+** (Backend için)
- **Node.js 18+** (Frontend için)
- **Maven** (veya Maven Wrapper - projede mevcut)

## 📦 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/tahakrcc/Yazilim-Muhendisliginde-Gelismeler.git
cd Yazilim-Muhendisliginde-Gelismeler
```

2. **Docker ile çalıştırın:**
```bash
docker-compose up -d
```

veya

3. **Manuel çalıştırın:**
```bash
# Windows
BASLAT.bat

# Linux/Mac
chmod +x BASLAT.sh
./BASLAT.sh
```

## 🐛 Sorun Giderme

### Backend başlamıyor
- Java 17+ yüklü mü kontrol edin: `java -version`
- Port 8080 kullanımda mı kontrol edin

### Frontend hatası
- `npm install` çalıştırın
- `node_modules` klasörünü silip tekrar `npm install` yapın

### React Hook Hatası
- `node_modules` klasörünü silin
- `npm install` çalıştırın
- Vite cache'i temizleyin: `rm -rf node_modules/.vite`

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👥 Katkıda Bulunanlar

- Backend: Spring Boot ile geliştirildi
- Frontend: React + TypeScript ile geliştirildi

---

**Not:** Bu proje pazarlarda ürün arama ve konum yönlendirme için geliştirilmiş bir demo uygulamasıdır.
