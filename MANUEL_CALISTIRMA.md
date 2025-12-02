# Manuel Çalıştırma Kılavuzu

## 📋 Gereksinimler

### Backend için:
- ✅ Java 17 veya üzeri
- ✅ Maven 3.6+ (veya Maven Wrapper)

### Frontend için:
- ✅ Node.js 18+ 
- ✅ npm veya yarn

## 🔧 Backend Çalıştırma

### Yöntem 1: Maven ile (Maven yüklüyse)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Yöntem 2: Maven Wrapper ile (Maven yoksa)

Maven Wrapper ekleyelim:

```bash
cd backend
# Maven Wrapper oluştur (eğer yoksa)
mvn wrapper:wrapper
```

Sonra:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Yöntem 3: JAR dosyası ile

```bash
cd backend
mvn clean package
java -jar target/pazar-backend-1.0.0.jar
```

**Backend çalışıyor mu kontrol:**
- http://localhost:8080/api/health
- http://localhost:8080/swagger-ui.html

## 🎨 Frontend Çalıştırma

### Adım 1: Dependencies Yükleme

```bash
cd frontend
npm install
```

### Adım 2: Development Server Başlatma

```bash
npm run dev
```

**Frontend çalışıyor mu kontrol:**
- http://localhost:3000

### Production Build (İsteğe bağlı)

```bash
npm run build
npm run preview
```

## ⚙️ Yapılandırma

### Backend Port Değiştirme

`backend/src/main/resources/application.properties` dosyasında:
```properties
server.port=8080
```

### Frontend Port Değiştirme

`frontend/vite.config.ts` dosyasında:
```typescript
server: {
  port: 3000
}
```

## 🔍 Sorun Giderme

### Maven bulunamıyor

**Çözüm 1: Maven Wrapper kullan**
```bash
cd backend
# Maven Wrapper oluştur
mvn wrapper:wrapper
```

**Çözüm 2: Maven yükle**
- https://maven.apache.org/download.cgi
- PATH'e ekle

### Node modules hatası

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port kullanımda hatası

**Windows:**
```powershell
# Port 8080 kullananı bul
netstat -ano | findstr :8080

# Port 3000 kullananı bul
netstat -ano | findstr :3000
```

**Linux/Mac:**
```bash
lsof -i :8080
lsof -i :3000
```

## 📝 Hızlı Başlangıç

### Yöntem 1: Otomatik Başlatma (Windows)

**Windows için:**
```bash
BASLAT.bat
```
Bu script her iki servisi de otomatik başlatır.

### Yöntem 2: Otomatik Başlatma (Linux/Mac)

```bash
chmod +x BASLAT.sh
./BASLAT.sh
```

### Yöntem 3: Manuel Başlatma

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

### Servislere Erişim

Her iki servis çalıştıktan sonra:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/api/health

