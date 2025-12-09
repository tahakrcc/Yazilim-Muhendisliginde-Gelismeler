package com.pazar.backend.controller;

import com.pazar.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://frontend:3000"})
@Tag(name = "Products", description = "Product management and search APIs")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Operation(summary = "Get All Products", description = "List all available products")
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @Operation(summary = "Search Products", description = "Search products by name with AI-powered suggestions")
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProducts(
            @RequestParam String query,
            @RequestParam(required = false) String marketId) {
        
        List<Map<String, Object>> results = productService.searchProducts(query, marketId);
        List<Map<String, Object>> marketProducts = productService.getMarketProducts(marketId != null ? marketId : "market_1");

        List<Map<String, Object>> enrichedResults = new ArrayList<>();
        for (Map<String, Object> product : results) {
            Map<String, Object> enriched = new HashMap<>(product);
            
            if (marketId != null && !marketProducts.isEmpty()) {
                List<Map<String, Object>> productInMarket = marketProducts.stream()
                    .filter(mp -> mp.get("productId").equals(product.get("id")))
                    .collect(Collectors.toList());
                
                if (!productInMarket.isEmpty()) {
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
        response.put("aiSuggestions", productService.generateAISuggestions(query));
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get Product Prices in Market", description = "Get all prices and locations for a product in a specific market")
    @GetMapping("/{productId}/prices")
    public ResponseEntity<Map<String, Object>> getProductPrices(
            @PathVariable String productId,
            @RequestParam String marketId) {
        
        Map<String, Object> product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        List<Map<String, Object>> marketProducts = productService.getMarketProducts(marketId);
        List<Map<String, Object>> productPrices = marketProducts.stream()
            .filter(mp -> mp.get("productId").equals(productId))
            .sorted(Comparator.comparingDouble(mp -> (Double) mp.get("price")))
            .collect(Collectors.toList());

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
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @Operation(summary = "Find Cheapest Product", description = "Find the cheapest vendor for a product - Requires authentication")
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{productId}/cheapest")
    public ResponseEntity<Map<String, Object>> findCheapest(
            @PathVariable String productId,
            @RequestParam String marketId) {
        
        Map<String, Object> product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        List<Map<String, Object>> marketProducts = productService.getMarketProducts(marketId);
        Optional<Map<String, Object>> cheapest = marketProducts.stream()
            .filter(mp -> mp.get("productId").equals(productId))
            .min(Comparator.comparingDouble(mp -> (Double) mp.get("price")));

        if (cheapest.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Product not found in market");
            return ResponseEntity.notFound().build();
        }

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
}

