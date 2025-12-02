package com.pazar.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
@Tag(name = "Products", description = "Product management and search APIs")
public class ProductController {

    // Mock database - ürünler ve pazarlardaki konumları
    private static final Map<String, Map<String, Object>> products_db = new ConcurrentHashMap<>();
    private static final Map<String, List<Map<String, Object>>> marketProducts_db = new ConcurrentHashMap<>();

    static {
        // Demo ürünler
        Map<String, Object> product1 = new HashMap<>();
        product1.put("id", "prod_1");
        product1.put("name", "Domates");
        product1.put("category", "Sebze");
        product1.put("unit", "kg");
        product1.put("freshness", "Taze");
        products_db.put("prod_1", product1);

        Map<String, Object> product2 = new HashMap<>();
        product2.put("id", "prod_2");
        product2.put("name", "Salatalık");
        product2.put("category", "Sebze");
        product2.put("unit", "kg");
        product2.put("freshness", "Taze");
        products_db.put("prod_2", product2);

        Map<String, Object> product3 = new HashMap<>();
        product3.put("id", "prod_3");
        product3.put("name", "Elma");
        product3.put("category", "Meyve");
        product3.put("unit", "kg");
        product3.put("freshness", "Taze");
        products_db.put("prod_3", product3);

        // Pazar 1'deki ürünler ve konumları
        List<Map<String, Object>> market1Products = new ArrayList<>();
        Map<String, Object> mp1 = new HashMap<>();
        mp1.put("productId", "prod_1");
        mp1.put("price", 18.50);
        mp1.put("stallNumber", "A-12");
        mp1.put("x", 120);
        mp1.put("y", 80);
        mp1.put("z", 0);
        mp1.put("vendorName", "Ahmet'in Sebzeleri");
        market1Products.add(mp1);

        Map<String, Object> mp2 = new HashMap<>();
        mp2.put("productId", "prod_1");
        mp2.put("price", 20.00);
        mp2.put("stallNumber", "B-05");
        mp2.put("x", 250);
        mp2.put("y", 150);
        mp2.put("z", 0);
        mp2.put("vendorName", "Mehmet Sebze");
        market1Products.add(mp2);

        Map<String, Object> mp3 = new HashMap<>();
        mp3.put("productId", "prod_2");
        mp3.put("price", 15.00);
        mp3.put("stallNumber", "A-08");
        mp3.put("x", 80);
        mp3.put("y", 60);
        mp3.put("z", 0);
        mp3.put("vendorName", "Taze Sebzeler");
        market1Products.add(mp3);

        marketProducts_db.put("market_1", market1Products);
    }

    @Operation(summary = "Get All Products", description = "List all available products")
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        return ResponseEntity.ok(new ArrayList<>(products_db.values()));
    }

    @Operation(summary = "Search Products", description = "Search products by name with AI-powered suggestions")
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProducts(
            @RequestParam String query,
            @RequestParam(required = false) String marketId) {
        
        // Yapay zeka destekli arama - benzer ürünleri de bul
        List<Map<String, Object>> results = products_db.values().stream()
            .filter(p -> {
                String name = p.get("name").toString().toLowerCase();
                String category = p.get("category").toString().toLowerCase();
                String queryLower = query.toLowerCase();
                
                // Tam eşleşme veya kısmi eşleşme
                return name.contains(queryLower) || 
                       category.contains(queryLower) ||
                       name.startsWith(queryLower.substring(0, Math.min(3, queryLower.length())));
            })
            .collect(Collectors.toList());

        // Eğer marketId verilmişse, fiyat ve konum bilgilerini ekle
        List<Map<String, Object>> enrichedResults = new ArrayList<>();
        for (Map<String, Object> product : results) {
            Map<String, Object> enriched = new HashMap<>(product);
            
            if (marketId != null && marketProducts_db.containsKey(marketId)) {
                List<Map<String, Object>> marketProducts = marketProducts_db.get(marketId);
                List<Map<String, Object>> productInMarket = marketProducts.stream()
                    .filter(mp -> mp.get("productId").equals(product.get("id")))
                    .collect(Collectors.toList());
                
                if (!productInMarket.isEmpty()) {
                    // En ucuz fiyatı bul
                    Optional<Map<String, Object>> cheapest = productInMarket.stream()
                        .min(Comparator.comparingDouble(mp -> (Double) mp.get("price")));
                    
                    if (cheapest.isPresent()) {
                        enriched.put("minPrice", cheapest.get().get("price"));
                        enriched.put("stallNumber", cheapest.get().get("stallNumber"));
                        enriched.put("location", Map.of(
                            "x", cheapest.get().get("x"),
                            "y", cheapest.get().get("y"),
                            "z", cheapest.get().get("z")
                        ));
                        enriched.put("vendorName", cheapest.get().get("vendorName"));
                    }
                    
                    // Tüm fiyatları ekle
                    enriched.put("allPrices", productInMarket.stream()
                        .map(mp -> Map.of(
                            "price", mp.get("price"),
                            "stallNumber", mp.get("stallNumber"),
                            "vendorName", mp.get("vendorName")
                        ))
                        .collect(Collectors.toList()));
                }
            }
            
            enrichedResults.add(enriched);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("query", query);
        response.put("results", enrichedResults);
        response.put("count", enrichedResults.size());
        response.put("aiSuggestions", generateAISuggestions(query));
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get Product Prices in Market", description = "Get all prices and locations for a product in a specific market")
    @GetMapping("/{productId}/prices")
    public ResponseEntity<Map<String, Object>> getProductPrices(
            @PathVariable String productId,
            @RequestParam String marketId) {
        
        if (!products_db.containsKey(productId)) {
            return ResponseEntity.notFound().build();
        }

        if (!marketProducts_db.containsKey(marketId)) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Market not found");
            return ResponseEntity.badRequest().body(error);
        }

        List<Map<String, Object>> productPrices = marketProducts_db.get(marketId).stream()
            .filter(mp -> mp.get("productId").equals(productId))
            .sorted(Comparator.comparingDouble(mp -> (Double) mp.get("price")))
            .collect(Collectors.toList());

        Map<String, Object> product = products_db.get(productId);
        Map<String, Object> response = new HashMap<>();
        response.put("product", product);
        response.put("prices", productPrices);
        response.put("cheapest", productPrices.isEmpty() ? null : productPrices.get(0));
        response.put("mostExpensive", productPrices.isEmpty() ? null : productPrices.get(productPrices.size() - 1));

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get Products by Category", description = "List products in specified category")
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Map<String, Object>>> getProductsByCategory(@PathVariable String category) {
        List<Map<String, Object>> results = products_db.values().stream()
            .filter(p -> p.get("category").toString().equalsIgnoreCase(category))
            .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    @Operation(summary = "Find Cheapest Product", description = "Find the cheapest vendor for a product")
    @GetMapping("/{productId}/cheapest")
    public ResponseEntity<Map<String, Object>> findCheapest(
            @PathVariable String productId,
            @RequestParam String marketId) {
        
        if (!marketProducts_db.containsKey(marketId)) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Market not found");
            return ResponseEntity.badRequest().body(error);
        }

        Optional<Map<String, Object>> cheapest = marketProducts_db.get(marketId).stream()
            .filter(mp -> mp.get("productId").equals(productId))
            .min(Comparator.comparingDouble(mp -> (Double) mp.get("price")));

        if (cheapest.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Product not found in market");
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> product = products_db.get(productId);
        Map<String, Object> response = new HashMap<>();
        response.put("product", product);
        response.put("cheapestOption", cheapest.get());
        response.put("route", Map.of(
            "stallNumber", cheapest.get().get("stallNumber"),
            "location", Map.of(
                "x", cheapest.get().get("x"),
                "y", cheapest.get().get("y"),
                "z", cheapest.get().get("z")
            ),
            "directions", "Pazar girişinden " + cheapest.get().get("stallNumber") + " numaralı tezgaha yürüyün"
        ));

        return ResponseEntity.ok(response);
    }

    private List<String> generateAISuggestions(String query) {
        List<String> suggestions = new ArrayList<>();
        String queryLower = query.toLowerCase();
        
        // Basit AI önerileri - benzer ürünler
        if (queryLower.contains("domat") || queryLower.contains("tomato")) {
            suggestions.add("Salatalık");
            suggestions.add("Biber");
            suggestions.add("Patlıcan");
        } else if (queryLower.contains("elma") || queryLower.contains("apple")) {
            suggestions.add("Armut");
            suggestions.add("Portakal");
            suggestions.add("Muz");
        } else if (queryLower.contains("sebze") || queryLower.contains("vegetable")) {
            suggestions.add("Meyve");
            suggestions.add("Yeşillik");
        }
        
        return suggestions;
    }
}

