# Yapay Zeka Destekli Güvenlik ve İyileştirme Önerileri

Projenizin kaynak kodları ve yapılandırma dosyaları bir Yapay Zeka güvenlik asistanı tarafından incelenmiş ve aşağıdaki 5 maddelik iyileştirme raporu oluşturulmuştur.

## 1. Hassas Verilerin Korunması (Environment Variables)
**Tespit:** `docker-compose.yml` dosyasında `GEMINI_API_KEY` ve veritabanı bağlantı bilgileri açık metin (plain text) olarak yer alıyor.
**Öneri:** Bu bilgileri `.env` dosyasına taşıyın ve bu dosyayı `.gitignore`'a ekleyin. Docker Compose içinde değişkenleri `${GEMINI_API_KEY}` formatında kullanın.
**Neden:** GitHub'a push yapıldığında API anahtarlarınızın çalınmasını önler.

## 2. Veritabanı Güvenliği (MongoDB Auth)
**Tespit:** MongoDB servisi şifresiz veya varsayılan ayarlarla çalıştırılıyor.
**Öneri:** MongoDB için `MONGO_INITDB_ROOT_USERNAME` ve `MONGO_INITDB_ROOT_PASSWORD` çevre değişkenlerini ayarlayın. Backend bağlantı string'ini buna göre güncelleyin.
**Neden:** Veritabanına yetkisiz erişimi engeller. Production ortamında verilerinizi korur.

## 3. CORS Yapılandırmasının Sıkılaştırılması
**Tespit:** Backend `SecurityConfig.java` dosyasında veya Controller'larda geniş izinli CORS tanımları olası.
**Öneri:** `AllowedOrigins` kısmında sadece frontend uygulamanızın çalıştığı domainlere (örn: `https://pazar-app.com`) izin verin. `*` (wildcard) kullanımından kaçının.
**Neden:** Başka web sitelerinin sizin API'nizi kullanıcı tarayıcısı üzerinden yetkisizce çağırmasını engeller.

## 4. Girdi Doğrulama ve Sanitizasyon (Input Validation)
**Tespit:** Kullanıcıdan alınan arama terimleri ve form verileri doğrudan işleniyor olabilir.
**Öneri:** Spring Boot `Starter Validation` kullanarak DTO'larınızda `@NotNull`, `@Size`, `@Email` gibi anotasyonları aktif kullanın. Ayrıca XSS (Siteler Arası Komut Çalıştırma) saldırılarına karşı girdileri sanitize edin.
**Neden:** Hatalı veya kötü niyetli verilerin sistemi bozmasını veya veri sızdırmasını engeller.

## 5. HTTPS Şifrelemesi (SSL/TLS)
**Tespit:** Servisler şu an `http://` protokolü üzerinden haberleşiyor.
**Öneri:** Production ortamında Nginx veya benzeri bir Reverse Proxy önüne SSL sertifikası (örn: Let's Encrypt) ekleyerek tüm trafiği `https://` üzerinden akıtın.
**Neden:** Kullanıcı şifreleri ve token'ları (JWT) ağ üzerinde şifreli taşınır, Man-in-the-Middle (Ortadaki Adam) saldırılarını engeller.
