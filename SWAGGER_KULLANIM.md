# Swagger/OpenAPI Kullanım Kılavuzu

## FastAPI Benzeri Otomatik Swagger Dokümantasyonu

Bu projede FastAPI'deki gibi otomatik Swagger dokümantasyonu desteği eklendi.

## Kurulum

### 1. Dependency Ekleme

`pom.xml` dosyasına SpringDoc OpenAPI dependency'si eklendi:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### 2. Konfigürasyon

`OpenApiConfig.java` dosyası ile Swagger konfigürasyonu yapıldı.

### 3. Controller'lara Annotation Ekleme

Controller'lara `@Tag` ve `@Operation` annotation'ları eklendi (örnek: `AuthController.java`)

## Kullanım

### Uygulamayı Çalıştırma

```bash
cd backend
mvn spring-boot:run
```

veya

```bash
mvn clean install
java -jar target/pazar-backend-1.0.0.jar
```

### Swagger UI'ya Erişim

Uygulama çalıştıktan sonra:

**Swagger UI:** http://localhost:8080/swagger-ui.html

veya

**Swagger UI (yeni versiyon):** http://localhost:8080/swagger-ui/index.html

**OpenAPI JSON:** http://localhost:8080/v3/api-docs

**OpenAPI YAML:** http://localhost:8080/v3/api-docs.yaml

## FastAPI ile Karşılaştırma

| FastAPI | Spring Boot (Bu Proje) |
|---------|------------------------|
| `http://127.0.0.1:8000/docs` | `http://localhost:8080/swagger-ui.html` |
| Otomatik dokümantasyon | Otomatik dokümantasyon (SpringDoc ile) |
| `@app.get()`, `@app.post()` | `@GetMapping()`, `@PostMapping()` |
| `@app.get()` decorator'ları | `@Operation()` annotation'ları |

## Örnek Kullanım

### AuthController Örneği

```java
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Kullanıcı kimlik doğrulama API'leri")
public class AuthController {
    
    @Operation(summary = "Kullanıcı girişi", description = "E-posta ve şifre ile kullanıcı girişi yapar")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // ...
    }
}
```

## Dosyalar

- `pom.xml` - Swagger dependency eklendi
- `OpenApiConfig.java` - Swagger konfigürasyonu
- `AuthController.java` - Örnek controller (Swagger annotation'ları ile)
- `swagger.yaml` - Manuel oluşturulmuş OpenAPI dokümantasyonu
- `PazarBackendApplication.java` - Main sınıfı

## Notlar

- Swagger UI otomatik olarak tüm endpoint'leri gösterir
- Controller'lara `@Tag` ve `@Operation` ekleyerek dokümantasyonu zenginleştirebilirsiniz
- SecurityConfig'de Swagger endpoint'leri için izin verilmiştir

