package com.pazar.backend.config;

import com.pazar.backend.entity.mongo.Market;
import com.pazar.backend.entity.mongo.MarketProduct;
import com.pazar.backend.entity.mongo.Product;
import com.pazar.backend.repository.MarketProductRepository;
import com.pazar.backend.repository.MarketRepository;
import com.pazar.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(MarketRepository marketRepository,
                               ProductRepository productRepository,
                               MarketProductRepository marketProductRepository) {
        return args -> {
            // Check if data already exists
            if (marketRepository.count() > 0) {
                System.out.println("MongoDB already initialized with data.");
                return;
            }

            System.out.println("Initializing MongoDB with demo data...");

            // Initialize Markets
            Map<String, Object> market1Map2D = Map.of(
                "width", 400,
                "height", 300,
                "stalls", Arrays.asList(
                    Map.of("id", "A-12", "x", 120, "y", 80, "z", 0, "type", "Sebze"),
                    Map.of("id", "B-05", "x", 250, "y", 150, "z", 0, "type", "Sebze"),
                    Map.of("id", "A-08", "x", 80, "y", 60, "z", 0, "type", "Sebze")
                )
            );
            Map<String, Object> market1Map3D = Map.of(
                "enabled", true,
                "floorCount", 2,
                "currentFloor", 0
            );

            Market market1 = new Market("market_1", "Merkez Pazar", "İstanbul, Kadıköy", 40.9884, 29.0232);
            market1.setOpeningHours("08:00 - 20:00");
            market1.setMap2D(market1Map2D);
            market1.setMap3D(market1Map3D);
            marketRepository.save(market1);

            Map<String, Object> market2Map2D = Map.of(
                "width", 500,
                "height", 400,
                "stalls", new ArrayList<>()
            );
            Map<String, Object> market2Map3D = Map.of(
                "enabled", true,
                "floorCount", 1,
                "currentFloor", 0
            );

            Market market2 = new Market("market_2", "Şişli Pazarı", "İstanbul, Şişli", 41.0600, 28.9870);
            market2.setOpeningHours("07:00 - 19:00");
            market2.setMap2D(market2Map2D);
            market2.setMap3D(market2Map3D);
            marketRepository.save(market2);

            // Initialize Products
            Product prod1 = new Product("prod_1", "Domates", "Sebze", "kg", "Taze");
            productRepository.save(prod1);

            Product prod2 = new Product("prod_2", "Salatalık", "Sebze", "kg", "Taze");
            productRepository.save(prod2);

            Product prod3 = new Product("prod_3", "Elma", "Meyve", "kg", "Taze");
            productRepository.save(prod3);

            // Initialize Market Products
            createMarketProduct(marketProductRepository, "market_1", "prod_1", 18.50, "A-12", 120, 80, 0, "Ahmet'in Sebzeleri");
            createMarketProduct(marketProductRepository, "market_1", "prod_1", 20.00, "B-05", 250, 150, 0, "Mehmet Sebze");
            createMarketProduct(marketProductRepository, "market_1", "prod_2", 15.00, "A-08", 80, 60, 0, "Taze Sebzeler");

            System.out.println("MongoDB data initialization completed.");
        };
    }

    private void createMarketProduct(MarketProductRepository repo, String marketId, String productId, 
                                     Double price, String stallNumber, int x, int y, int z, String vendorName) {
        MarketProduct mp = new MarketProduct();
        mp.setMarketId(marketId);
        mp.setProductId(productId);
        mp.setPrice(price);
        mp.setStallNumber(stallNumber);
        mp.setX(x);
        mp.setY(y);
        mp.setZ(z);
        mp.setVendorName(vendorName);
        repo.save(mp);
    }
}
