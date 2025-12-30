package com.pazar.backend.service;

import com.pazar.backend.entity.mongo.MarketProduct;
import com.pazar.backend.entity.mongo.Product;
import com.pazar.backend.repository.MarketProductRepository;
import com.pazar.backend.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final MarketProductRepository marketProductRepository;
    private final ObjectMapper objectMapper;

    public ProductService(ProductRepository productRepository, 
                          MarketProductRepository marketProductRepository,
                          ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.marketProductRepository = marketProductRepository;
        this.objectMapper = objectMapper;
    }

    public List<Map<String, Object>> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> searchProducts(String query, String marketId) {
        // Note: marketId is currently unused as per original implementation logic
        return productRepository.searchByNameOrCategory(query).stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMarketProducts(String marketId) {
        return marketProductRepository.findByMarketId(marketId).stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getProductById(String productId) {
        return productRepository.findById(productId)
                .map(this::convertToMap)
                .orElse(null);
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
        Product product = convertToEntity(productData, Product.class);
        if (product.getId() == null) {
            product.setId("prod_" + System.currentTimeMillis());
        }
        Product savedProduct = productRepository.save(product);
        return convertToMap(savedProduct);
    }

    public Map<String, Object> updateProduct(String productId, Map<String, Object> productData) {
        if (!productRepository.existsById(productId)) return null;
        
        Product product = convertToEntity(productData, Product.class);
        product.setId(productId);
        
        Product updatedProduct = productRepository.save(product);
        return convertToMap(updatedProduct);
    }

    public boolean deleteProduct(String productId) {
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
            return true;
        }
        return false;
    }

    public Map<String, Object> addProductToMarket(String marketId, Map<String, Object> marketProductData) {
        MarketProduct marketProduct = convertToEntity(marketProductData, MarketProduct.class);
        marketProduct.setMarketId(marketId);
        
        if (marketProduct.getId() == null) {
            marketProduct.setId(UUID.randomUUID().toString());
        }
        
        MarketProduct saved = marketProductRepository.save(marketProduct);
        return convertToMap(saved);
    }

    public boolean removeProductFromMarket(String marketId, String productId, String stallNumber) {
        marketProductRepository.deleteByMarketIdAndProductIdAndStallNumber(marketId, productId, stallNumber);
        return true; 
    }

    private <T> Map<String, Object> convertToMap(T entity) {
        return objectMapper.convertValue(entity, Map.class);
    }

    private <T> T convertToEntity(Map<String, Object> map, Class<T> clazz) {
        return objectMapper.convertValue(map, clazz);
    }
}

