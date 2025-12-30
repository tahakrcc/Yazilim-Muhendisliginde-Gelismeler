package com.pazar.backend.controller;

import com.pazar.backend.service.MarketService;
import com.pazar.backend.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = {"http://localhost:5173", "http://frontend:3000"})
@Tag(name = "Seller", description = "Seller specific APIs")
public class SellerController {

    @Autowired
    private MarketService marketService;

    @Autowired
    private ProductService productService;

    @Operation(summary = "Claim Stall and Add Product", description = "Seller claims a spot on map and adds a product")
    @PostMapping("/stall/claim")
    public ResponseEntity<Map<String, Object>> claimStallAndAddProduct(@RequestBody Map<String, Object> request) {
        try {
            String marketId = (String) request.get("marketId");
            Map<String, Object> productData = (Map<String, Object>) request.get("productData");
            Map<String, Object> positionData = (Map<String, Object>) request.get("position");
            String vendorName = (String) request.get("vendorName");
            Double price = Double.valueOf(request.get("price").toString());

            // 1. Create Product if new or use existing ID if provided (simplified: assuming new or selection)
            // For now, let's assume we create a new product entry or link to an existing generic product type
            // But usually seller says "I am selling Tomatoes" which is prod_1. 
            // So request should ideally contain productId. If not, we might need to create it.
            
            String productId = (String) productData.get("id");
            if (productId == null) {
                // If it's a completely new custom product
                Map<String, Object> newProd = productService.createProduct(productData);
                productId = (String) newProd.get("id");
            }

            // 2. Add to MarketProducts (Price listing)
            String stallNumber = "S-" + System.currentTimeMillis() % 1000; // Generate fake stall number
            
            Map<String, Object> marketProductData = new HashMap<>();
            marketProductData.put("productId", productId);
            marketProductData.put("price", price);
            marketProductData.put("stallNumber", stallNumber);
            marketProductData.put("x", positionData.get("x"));
            marketProductData.put("y", positionData.get("y"));
            marketProductData.put("z", positionData.getOrDefault("z", 0));
            marketProductData.put("vendorName", vendorName);
            
            productService.addProductToMarket(marketId, marketProductData);

            // 3. Update Market Map (Visual representation)
            Map<String, Object> stallData = new HashMap<>();
            stallData.put("id", stallNumber);
            stallData.put("x", positionData.get("x"));
            stallData.put("y", positionData.get("y"));
            stallData.put("z", positionData.getOrDefault("z", 0));
            stallData.put("type", productData.get("category"));
            stallData.put("vendorName", vendorName); // Add vendor info to map stall
            
            marketService.addStallToMarket(marketId, stallData);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Stall claimed and product added successfully");
            response.put("stallNumber", stallNumber);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error claiming stall: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @Operation(summary = "Get Seller Products", description = "Get products listed by this seller (mock implementation)")
    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getSellerProducts(@RequestParam String vendorName) {
        // In a real app, we would query by sellerId from token. 
        // Here we can mock or filter by vendorName string if we had it in MarketProduct.
        // For simplicity, returning empty list or all products for demo.
        return ResponseEntity.ok(List.of()); 
    }
}
