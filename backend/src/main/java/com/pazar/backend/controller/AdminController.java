package com.pazar.backend.controller;

import com.pazar.backend.service.MarketService;
import com.pazar.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://frontend:3000"})
@Tag(name = "Admin", description = "Admin management APIs - Requires ADMIN role")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    @Autowired
    private ProductService productService;

    @Autowired
    private MarketService marketService;

    @Operation(summary = "Get Admin Dashboard", description = "Get admin dashboard data - Requires ADMIN authentication")
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalMarkets", marketService.getAllMarkets().size());
        dashboard.put("totalProducts", productService.getAllProducts().size());
        dashboard.put("totalUsers", 10);
        dashboard.put("message", "Admin dashboard data");
        return ResponseEntity.ok(dashboard);
    }

    @Operation(summary = "Get System Stats", description = "Get system statistics - Requires ADMIN authentication")
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeMarkets", marketService.getAllMarkets().size());
        stats.put("activeProducts", productService.getAllProducts().size());
        stats.put("systemStatus", "Healthy");
        stats.put("uptime", "24 hours");
        return ResponseEntity.ok(stats);
    }

    // Product Management
    @Operation(summary = "Create Product", description = "Create a new product - Admin only")
    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Map<String, Object> productData) {
        Map<String, Object> product = productService.createProduct(productData);
        return ResponseEntity.ok(product);
    }

    @Operation(summary = "Update Product", description = "Update an existing product - Admin only")
    @PutMapping("/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable String productId,
            @RequestBody Map<String, Object> productData) {
        Map<String, Object> product = productService.updateProduct(productId, productData);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @Operation(summary = "Delete Product", description = "Delete a product - Admin only")
    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable String productId) {
        boolean deleted = productService.deleteProduct(productId);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Add Product to Market", description = "Add a product to a market with price and location - Admin only")
    @PostMapping("/markets/{marketId}/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> addProductToMarket(
            @PathVariable String marketId,
            @RequestBody Map<String, Object> marketProductData) {
        Map<String, Object> result = productService.addProductToMarket(marketId, marketProductData);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Remove Product from Market", description = "Remove a product from a market - Admin only")
    @DeleteMapping("/markets/{marketId}/products/{productId}/stalls/{stallNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> removeProductFromMarket(
            @PathVariable String marketId,
            @PathVariable String productId,
            @PathVariable String stallNumber) {
        boolean removed = productService.removeProductFromMarket(marketId, productId, stallNumber);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product removed from market successfully");
        return ResponseEntity.ok(response);
    }

    // Market Management
    @Operation(summary = "Create Market", description = "Create a new market - Admin only")
    @PostMapping("/markets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createMarket(@RequestBody Map<String, Object> marketData) {
        Map<String, Object> market = marketService.createMarket(marketData);
        return ResponseEntity.ok(market);
    }

    @Operation(summary = "Update Market", description = "Update an existing market - Admin only")
    @PutMapping("/markets/{marketId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateMarket(
            @PathVariable String marketId,
            @RequestBody Map<String, Object> marketData) {
        Map<String, Object> market = marketService.updateMarket(marketId, marketData);
        if (market == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(market);
    }

    @Operation(summary = "Delete Market", description = "Delete a market - Admin only")
    @DeleteMapping("/markets/{marketId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteMarket(@PathVariable String marketId) {
        boolean deleted = marketService.deleteMarket(marketId);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Market deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Add Stall to Market", description = "Add a stall to a market - Admin only")
    @PostMapping("/markets/{marketId}/stalls")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> addStallToMarket(
            @PathVariable String marketId,
            @RequestBody Map<String, Object> stallData) {
        Map<String, Object> result = marketService.addStallToMarket(marketId, stallData);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Remove Stall from Market", description = "Remove a stall from a market - Admin only")
    @DeleteMapping("/markets/{marketId}/stalls/{stallId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> removeStallFromMarket(
            @PathVariable String marketId,
            @PathVariable String stallId) {
        boolean removed = marketService.removeStallFromMarket(marketId, stallId);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Stall removed from market successfully");
        return ResponseEntity.ok(response);
    }
}

