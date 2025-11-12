# Basit Backend Örneği - Pazar Yönetim Sistemi

Bu dosya, ElifKavurga'nın `main.py` örneğine benzer şekilde çalışan basit bir Spring Boot backend örneğidir.

## Özellikler

- ✅ Mock veritabanı (in-memory)
- ✅ Kullanıcı kayıt/giriş işlemleri
- ✅ Pazar yönetimi (CRUD)
- ✅ Ürün yönetimi (CRUD)
- ✅ Ürün arama ve filtreleme
- ✅ Swagger/OpenAPI dokümantasyonu
- ✅ CORS desteği

## Çalıştırma

### 1. Maven ile çalıştırma

```bash
cd github-docs
mvn spring-boot:run -f pom.xml
```

veya

```bash
mvn clean install
java -jar target/pazar-backend-1.0.0.jar
```

### 2. Swagger UI'ya Erişim

Uygulama çalıştıktan sonra:

**Swagger UI:** http://localhost:8080/swagger-ui.html

## API Endpoint'leri

### Root
- `GET /` - API durumu

### Kullanıcı İşlemleri
- `POST /register` - Kullanıcı kaydı
- `POST /login` - Kullanıcı girişi

### Pazar İşlemleri
- `GET /marketplaces` - Tüm pazarları getir
- `POST /marketplaces` - Yeni pazar oluştur
- `DELETE /marketplaces/{id}` - Pazar sil

### Ürün İşlemleri
- `GET /products` - Tüm ürünleri getir
- `POST /products` - Yeni ürün oluştur
- `PUT /products/{id}` - Ürün güncelle
- `DELETE /products/{id}` - Ürün sil
- `GET /products/search?name={name}` - Ürün ara
- `GET /products/category/{category}` - Kategoriye göre ürünleri getir

## Örnek Kullanım

### Kullanıcı Kaydı

```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@pazar.com",
    "password": "123456",
    "name": "Test Kullanıcı"
  }'
```

### Kullanıcı Girişi

```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pazar.com",
    "password": "123456"
  }'
```

### Pazar Oluşturma

```bash
curl -X POST http://localhost:8080/marketplaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beşiktaş Pazarı",
    "address": "Beşiktaş, İstanbul",
    "latitude": 41.0422,
    "longitude": 29.0089,
    "isOpenToday": true
  }'
```

### Ürün Oluşturma

```bash
curl -X POST http://localhost:8080/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Salatalık",
    "category": "Sebze",
    "unit": "kg",
    "price": 15.00,
    "stock": 50
  }'
```

### Ürün Arama

```bash
curl http://localhost:8080/products/search?name=domates
```

## Demo Veriler

Uygulama ilk çalıştırıldığında otomatik olarak eklenen demo veriler:

- **Kullanıcı:** admin@pazar.com / 123456
- **Pazar:** Kadıköy Pazarı
- **Ürün:** Domates (Sebze kategorisinde)

## FastAPI Örneği ile Karşılaştırma

| Özellik | FastAPI (ElifKavurga) | Spring Boot (Bu Örnek) |
|---------|----------------------|----------------------|
| Framework | FastAPI | Spring Boot |
| Dil | Python | Java |
| Mock DB | List/Dict | ConcurrentHashMap |
| Swagger | Otomatik (`/docs`) | Otomatik (`/swagger-ui.html`) |
| Çalıştırma | `uvicorn main:app --reload` | `mvn spring-boot:run` |

## Notlar

- Bu basit bir örnek kodudur, gerçek uygulamada veritabanı kullanılmalıdır
- Şifreler şifrelenmeden saklanmaktadır (demo amaçlı)
- JWT token'lar gerçek değildir (demo amaçlı)
- Veriler uygulama yeniden başlatıldığında sıfırlanır

