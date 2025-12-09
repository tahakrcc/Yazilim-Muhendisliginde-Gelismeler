package com.pazar.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Map<String, Map<String, Object>> products_db = new ConcurrentHashMap<>();
    private static final Map<String, List<Map<String, Object>>> marketProducts_db = new ConcurrentHashMap<>();

    static {
        initializeDemoData();
    }

    private static void initializeDemoData() {
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

    public List<Map<String, Object>> getAllProducts() {
        return new ArrayList<>(products_db.values());
    }

    public List<Map<String, Object>> searchProducts(String query, String marketId) {
        return products_db.values().stream()
            .filter(p -> {
                String name = p.get("name").toString().toLowerCase();
                String category = p.get("category").toString().toLowerCase();
                String queryLower = query.toLowerCase();
                
                return name.contains(queryLower) || 
                       category.contains(queryLower) ||
                       name.startsWith(queryLower.substring(0, Math.min(3, queryLower.length())));
            })
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getProductsByCategory(String category) {
        return products_db.values().stream()
            .filter(p -> p.get("category").toString().equalsIgnoreCase(category))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMarketProducts(String marketId) {
        return marketProducts_db.getOrDefault(marketId, new ArrayList<>());
    }

    public Map<String, Object> getProductById(String productId) {
        return products_db.get(productId);
    }

    public List<String> generateAISuggestions(String query) {
        List<String> suggestions = new ArrayList<>();
        String queryLower = query.toLowerCase();
        
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

    // Admin CRUD operations
    public Map<String, Object> createProduct(Map<String, Object> productData) {
        String id = "prod_" + System.currentTimeMillis();
        Map<String, Object> product = new HashMap<>(productData);
        product.put("id", id);
        products_db.put(id, product);
        return product;
    }

    public Map<String, Object> updateProduct(String productId, Map<String, Object> productData) {
        Map<String, Object> existing = products_db.get(productId);
        if (existing == null) return null;
        
        Map<String, Object> updated = new HashMap<>(existing);
        updated.putAll(productData);
        updated.put("id", productId); // ID değiştirilemez
        products_db.put(productId, updated);
        return updated;
    }

    public boolean deleteProduct(String productId) {
        return products_db.remove(productId) != null;
    }

    public Map<String, Object> addProductToMarket(String marketId, Map<String, Object> marketProductData) {
        List<Map<String, Object>> marketProducts = marketProducts_db.getOrDefault(marketId, new ArrayList<>());
        marketProducts.add(new HashMap<>(marketProductData));
        marketProducts_db.put(marketId, marketProducts);
        return marketProductData;
    }

    public boolean removeProductFromMarket(String marketId, String productId, String stallNumber) {
        List<Map<String, Object>> marketProducts = marketProducts_db.get(marketId);
        if (marketProducts == null) return false;
        
        boolean removed = marketProducts.removeIf(mp -> 
            mp.get("productId").equals(productId) && 
            mp.get("stallNumber").equals(stallNumber)
        );
        return removed;
    }
}

