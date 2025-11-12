package com.pazar.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Pazar Yönetim Sistemi - Basit Backend Örneği
 * ElifKavurga'nın main.py örneğine benzer şekilde çalışan basit bir backend
 * 
 * Çalıştırmak için: mvn spring-boot:run
 * Swagger UI: http://localhost:8080/swagger-ui.html
 */
@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
@Tag(name = "Pazar Yönetim Sistemi", description = "Basit pazar yönetimi API'leri")
public class SimpleBackendExample {

    // --- MOCK VERİTABANI ---
    // Demo kullanıcıları
    private static final Map<String, Map<String, Object>> users_db = new ConcurrentHashMap<>();
    
    // Pazarlar
    private static final Map<String, Map<String, Object>> marketplaces_db = new ConcurrentHashMap<>();
    
    // Ürünler
    private static final Map<String, Map<String, Object>> products_db = new ConcurrentHashMap<>();
    
    // İlk çalıştırmada demo verileri ekle
    static {
        // Demo kullanıcı
        Map<String, Object> demoUser = new HashMap<>();
        demoUser.put("id", "user_1");
        demoUser.put("email", "admin@pazar.com");
        demoUser.put("password", "123456");
        demoUser.put("name", "Demo Admin");
        demoUser.put("role", "ADMIN");
        users_db.put("user_1", demoUser);
        
        // Demo pazar
        Map<String, Object> demoMarketplace = new HashMap<>();
        demoMarketplace.put("id", "marketplace_1");
        demoMarketplace.put("name", "Kadıköy Pazarı");
        demoMarketplace.put("address", "Kadıköy, İstanbul");
        demoMarketplace.put("latitude", 40.9884);
        demoMarketplace.put("longitude", 29.0232);
        demoMarketplace.put("isOpenToday", true);
        marketplaces_db.put("marketplace_1", demoMarketplace);
        
        // Demo ürün
        Map<String, Object> demoProduct = new HashMap<>();
        demoProduct.put("id", "product_1");
        demoProduct.put("name", "Domates");
        demoProduct.put("category", "Sebze");
        demoProduct.put("unit", "kg");
        demoProduct.put("price", 25.50);
        demoProduct.put("stock", 100);
        products_db.put("product_1", demoProduct);
    }

    public static void main(String[] args) {
        SpringApplication.run(SimpleBackendExample.class, args);
    }

    // --- ROOT ENDPOINT ---
    @Operation(summary = "API Durumu", description = "API'nin çalışıp çalışmadığını kontrol eder")
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("mesaj", "Pazar Yönetim Sistemi API çalışıyor!");
        response.put("version", "1.0.0");
        response.put("status", "UP");
        return ResponseEntity.ok(response);
    }

    // --- KULLANICI İŞLEMLERİ ---
    
    @Operation(summary = "Kullanıcı kaydı", description = "Yeni kullanıcı kaydı oluşturur")
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");
        String password = userData.get("password");
        String name = userData.get("name");
        
        // E-posta kontrolü
        boolean emailExists = users_db.values().stream()
            .anyMatch(u -> u.get("email").equals(email));
        
        if (emailExists) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Bu e-posta zaten kayıtlı.");
            return ResponseEntity.badRequest().body(error);
        }
        
        String userId = "user_" + (users_db.size() + 1);
        Map<String, Object> newUser = new HashMap<>();
        newUser.put("id", userId);
        newUser.put("email", email);
        newUser.put("password", password);
        newUser.put("name", name);
        newUser.put("role", "USER");
        
        users_db.put(userId, newUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("mesaj", "Kayıt başarılı");
        response.put("user_id", userId);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Kullanıcı girişi", description = "E-posta ve şifre ile giriş yapar")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<Map<String, Object>> userOpt = users_db.values().stream()
            .filter(u -> u.get("email").equals(email) && u.get("password").equals(password))
            .findFirst();
        
        if (userOpt.isPresent()) {
            Map<String, Object> user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("mesaj", "Giriş başarılı");
            response.put("token", "fake-jwt-token-" + user.get("id"));
            response.put("user_id", user.get("id"));
            response.put("name", user.get("name"));
            response.put("role", user.get("role"));
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Hatalı e-posta veya şifre");
        return ResponseEntity.status(401).body(error);
    }

    // --- PAZAR İŞLEMLERİ ---
    
    @Operation(summary = "Tüm pazarları getir", description = "Sistemdeki tüm pazarları listeler")
    @GetMapping("/marketplaces")
    public ResponseEntity<List<Map<String, Object>>> getMarketplaces() {
        return ResponseEntity.ok(new ArrayList<>(marketplaces_db.values()));
    }

    @Operation(summary = "Pazar oluştur", description = "Yeni bir pazar ekler")
    @PostMapping("/marketplaces")
    public ResponseEntity<Map<String, Object>> createMarketplace(@RequestBody Map<String, Object> marketplaceData) {
        String marketplaceId = "marketplace_" + (marketplaces_db.size() + 1);
        
        Map<String, Object> newMarketplace = new HashMap<>();
        newMarketplace.put("id", marketplaceId);
        newMarketplace.put("name", marketplaceData.get("name"));
        newMarketplace.put("address", marketplaceData.get("address"));
        newMarketplace.put("latitude", marketplaceData.get("latitude"));
        newMarketplace.put("longitude", marketplaceData.get("longitude"));
        newMarketplace.put("isOpenToday", marketplaceData.getOrDefault("isOpenToday", true));
        
        marketplaces_db.put(marketplaceId, newMarketplace);
        return ResponseEntity.status(201).body(newMarketplace);
    }

    @Operation(summary = "Pazar sil", description = "Belirtilen pazarı siler")
    @DeleteMapping("/marketplaces/{id}")
    public ResponseEntity<Void> deleteMarketplace(@PathVariable String id) {
        if (marketplaces_db.containsKey(id)) {
            marketplaces_db.remove(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- ÜRÜN İŞLEMLERİ ---
    
    @Operation(summary = "Tüm ürünleri getir", description = "Sistemdeki tüm ürünleri listeler")
    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getProducts() {
        return ResponseEntity.ok(new ArrayList<>(products_db.values()));
    }

    @Operation(summary = "Ürün oluştur", description = "Yeni bir ürün ekler")
    @PostMapping("/products")
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Map<String, Object> productData) {
        String productId = "product_" + (products_db.size() + 1);
        
        Map<String, Object> newProduct = new HashMap<>();
        newProduct.put("id", productId);
        newProduct.put("name", productData.get("name"));
        newProduct.put("category", productData.get("category"));
        newProduct.put("unit", productData.get("unit"));
        newProduct.put("price", productData.get("price"));
        newProduct.put("stock", productData.getOrDefault("stock", 0));
        
        products_db.put(productId, newProduct);
        return ResponseEntity.status(201).body(newProduct);
    }

    @Operation(summary = "Ürün güncelle", description = "Mevcut bir ürünü günceller")
    @PutMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable String id,
            @RequestBody Map<String, Object> productData) {
        if (!products_db.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> product = products_db.get(id);
        if (productData.containsKey("name")) product.put("name", productData.get("name"));
        if (productData.containsKey("category")) product.put("category", productData.get("category"));
        if (productData.containsKey("price")) product.put("price", productData.get("price"));
        if (productData.containsKey("stock")) product.put("stock", productData.get("stock"));
        
        return ResponseEntity.ok(product);
    }

    @Operation(summary = "Ürün sil", description = "Belirtilen ürünü siler")
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        if (products_db.containsKey(id)) {
            products_db.remove(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- ARAMA İŞLEMLERİ ---
    
    @Operation(summary = "Ürün ara", description = "Ürün adına göre arama yapar")
    @GetMapping("/products/search")
    public ResponseEntity<List<Map<String, Object>>> searchProducts(@RequestParam String name) {
        List<Map<String, Object>> results = products_db.values().stream()
            .filter(p -> p.get("name").toString().toLowerCase().contains(name.toLowerCase()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    @Operation(summary = "Kategoriye göre ürünleri getir", description = "Belirtilen kategorideki ürünleri listeler")
    @GetMapping("/products/category/{category}")
    public ResponseEntity<List<Map<String, Object>>> getProductsByCategory(@PathVariable String category) {
        List<Map<String, Object>> results = products_db.values().stream()
            .filter(p -> p.get("category").toString().equalsIgnoreCase(category))
            .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }
}

