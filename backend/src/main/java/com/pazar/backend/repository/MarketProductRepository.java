package com.pazar.backend.repository;

import com.pazar.backend.entity.mongo.MarketProduct;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketProductRepository extends MongoRepository<MarketProduct, String> {
    
    List<MarketProduct> findByMarketId(String marketId);
    
    List<MarketProduct> findByProductId(String productId);
    
    List<MarketProduct> findByProductIdAndMarketId(String productId, String marketId);
    
    void deleteByMarketIdAndProductIdAndStallNumber(String marketId, String productId, String stallNumber);
}
