# Docker Build Sorun Giderme

## Hata: "failed to fetch oauth token: dial tcp: lookup auth.docker.io: no such host"

Bu hata, Docker'ın Docker Hub'a bağlanamadığını gösterir. Çözümler:

### 1. İnternet Bağlantısını Kontrol Edin
```powershell
ping docker.io
ping auth.docker.io
```

### 2. Docker Desktop'u Yeniden Başlatın
- Docker Desktop'u kapatın ve tekrar açın
- Sistem yeniden başlatmayı deneyin

### 3. DNS Ayarlarını Kontrol Edin
Docker Desktop Settings > Resources > Network > DNS ayarlarını kontrol edin.

### 4. Proxy/Firewall Sorunu
Eğer proxy veya firewall kullanıyorsanız, Docker'ın erişimine izin verin.

### 5. Alternatif: Offline Build (Eğer image'lar zaten indirilmişse)
```powershell
# Önce image'ları manuel olarak çekin
docker pull maven:3.9.6-eclipse-temurin-17
docker pull eclipse-temurin:17-jre-alpine
docker pull node:20-alpine
docker pull nginx:alpine

# Sonra build edin
docker-compose up --build
```

### 6. Docker Hub Yerine Alternatif Registry
Eğer sürekli sorun yaşıyorsanız, Docker Desktop ayarlarından registry mirror ekleyebilirsiniz.

### 7. Manuel Build (Tek Tek)
```powershell
# Backend'i ayrı build edin
cd backend
docker build -t pazar-backend .

# Frontend'i ayrı build edin
cd ../frontend
docker build -t pazar-frontend .

# Sonra compose ile çalıştırın
cd ..
docker-compose up
```

### 8. Network Sorunu İçin
```powershell
# Docker network'ü temizleyin
docker network prune

# Docker'ı resetleyin (dikkatli kullanın)
docker system prune -a
```

## Hızlı Test
```powershell
# Docker Hub'a erişim testi
docker pull hello-world
```

Eğer bu komut çalışırsa, sorun çözülmüştür ve tekrar deneyebilirsiniz:
```powershell
docker-compose up --build
```

