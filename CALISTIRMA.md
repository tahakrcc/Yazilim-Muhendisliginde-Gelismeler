# Projeyi Çalıştırma Kılavuzu

## 🐳 Docker ile Çalıştırma (Önerilen)

### Gereksinimler
- Docker Desktop yüklü ve çalışıyor olmalı

### Adımlar

1. **Docker Desktop'ı başlatın**
   - Windows: Başlat menüsünden "Docker Desktop" uygulamasını açın
   - Docker Desktop'ın çalıştığından emin olun (sistem tepsisinde Docker ikonu görünmeli)

2. **Projeyi çalıştırın**
   ```bash
   docker-compose up -d
   ```

3. **Servislere erişin**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html

4. **Logları görüntüleme**
   ```bash
   docker-compose logs -f
   ```

5. **Durdurma**
   ```bash
   docker-compose down
   ```

## 🔧 Manuel Çalıştırma

### Backend (Spring Boot)

1. **Java 17 yüklü olmalı**
   ```bash
   java -version
   ```

2. **Maven ile çalıştırma**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Backend çalışıyor mu kontrol edin**
   - http://localhost:8080/api/health

### Frontend (React)

1. **Node.js yüklü olmalı**
   ```bash
   node --version
   ```

2. **Dependencies yükleme**
   ```bash
   cd frontend
   npm install
   ```

3. **Development server başlatma**
   ```bash
   npm run dev
   ```

4. **Frontend çalışıyor mu kontrol edin**
   - http://localhost:3000

## ⚠️ Sorun Giderme

### Docker hatası alıyorsanız

1. **Docker Desktop çalışıyor mu?**
   - Sistem tepsisinde Docker ikonunu kontrol edin
   - Docker Desktop'ı yeniden başlatın

2. **Portlar kullanımda mı?**
   - 8080 ve 3000 portlarının boş olduğundan emin olun
   - Başka bir uygulama bu portları kullanıyorsa kapatın

3. **Docker compose versiyonu**
   ```bash
   docker compose version
   ```
   Eğer `docker-compose` komutu çalışmıyorsa, `docker compose` (tire olmadan) kullanın

### Backend hatası alıyorsanız

1. **Java versiyonu kontrol**
   ```bash
   java -version
   ```
   Java 17 veya üzeri olmalı

2. **Maven dependencies**
   ```bash
   cd backend
   mvn clean install
   ```

### Frontend hatası alıyorsanız

1. **Node modules eksik**
   ```bash
   cd frontend
   npm install
   ```

2. **Build hatası**
   ```bash
   npm run build
   ```

## 📊 Durum Kontrolü

### Servislerin durumunu kontrol etme
```bash
docker-compose ps
```

### Logları görüntüleme
```bash
# Tüm servisler
docker-compose logs

# Sadece backend
docker-compose logs pazar-backend

# Sadece frontend
docker-compose logs pazar-frontend
```

### Servisleri yeniden başlatma
```bash
docker-compose restart
```

