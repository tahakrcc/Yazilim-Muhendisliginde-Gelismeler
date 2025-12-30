package com.pazar.backend.repository;

import com.pazar.backend.entity.mongo.Market;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketRepository extends MongoRepository<Market, String> {
}
