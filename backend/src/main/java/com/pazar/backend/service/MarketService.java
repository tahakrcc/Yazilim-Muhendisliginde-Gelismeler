package com.pazar.backend.service;

import com.pazar.backend.entity.mongo.Market;
import com.pazar.backend.repository.MarketRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarketService {

    private final MarketRepository marketRepository;
    private final ObjectMapper objectMapper;

    public MarketService(MarketRepository marketRepository, ObjectMapper objectMapper) {
        this.marketRepository = marketRepository;
        this.objectMapper = objectMapper;
    }

    public List<Map<String, Object>> getAllMarkets() {
        return marketRepository.findAll().stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getMarketById(String marketId) {
        return marketRepository.findById(marketId)
                .map(this::convertToMap)
                .orElse(null);
    }

    public Map<String, Object> getMarketMap(String marketId) {
        return marketRepository.findById(marketId)
                .map(market -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("marketId", market.getId());
                    response.put("marketName", market.getName());
                    response.put("map2D", market.getMap2D());
                    response.put("map3D", market.getMap3D());
                    return response;
                })
                .orElse(null);
    }

    public Map<String, Object> getRoute(String marketId, String stallNumber) {
        Optional<Market> marketOpt = marketRepository.findById(marketId);
        if (marketOpt.isEmpty()) return null;

        Market market = marketOpt.get();
        Map<String, Object> map2D = market.getMap2D();
        if (map2D == null) return null;
        
        List<Map<String, Object>> stalls = (List<Map<String, Object>>) map2D.get("stalls");
        if (stalls == null) return null;

        Optional<Map<String, Object>> stallOpt = stalls.stream()
            .filter(s -> s.get("id").equals(stallNumber))
            .findFirst();

        if (stallOpt.isEmpty()) return null;

        Map<String, Object> stall = stallOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("stallNumber", stallNumber);
        response.put("location", Map.of(
            "x", stall.get("x"),
            "y", stall.get("y"),
            "z", stall.getOrDefault("z", 0)
        ));
        response.put("directions", "Pazar girişinden " + stallNumber + " numaralı tezgaha yürüyün. Konum: X=" + 
                     stall.get("x") + ", Y=" + stall.get("y"));
        response.put("estimatedTime", "2-3 dakika");

        return response;
    }

    // Admin CRUD operations
    public Map<String, Object> createMarket(Map<String, Object> marketData) {
        Market market = convertToEntity(marketData);
        if (market.getId() == null) {
            market.setId("market_" + System.currentTimeMillis());
        }
        
        // Default map structure if not provided
        if (market.getMap2D() == null) {
            market.setMap2D(Map.of(
                "width", 400,
                "height", 300,
                "stalls", new ArrayList<>()
            ));
        }
        if (market.getMap3D() == null) {
            market.setMap3D(Map.of(
                "enabled", true,
                "floorCount", 1,
                "currentFloor", 0
            ));
        }
        
        Market savedMarket = marketRepository.save(market);
        return convertToMap(savedMarket);
    }

    public Map<String, Object> updateMarket(String marketId, Map<String, Object> marketData) {
        if (!marketRepository.existsById(marketId)) return null;
        
        Market market = convertToEntity(marketData);
        market.setId(marketId);
        
        Market updatedMarket = marketRepository.save(market);
        return convertToMap(updatedMarket);
    }

    public boolean deleteMarket(String marketId) {
        if (marketRepository.existsById(marketId)) {
            marketRepository.deleteById(marketId);
            return true;
        }
        return false;
    }

    public Map<String, Object> addStallToMarket(String marketId, Map<String, Object> stallData) {
        Optional<Market> marketOpt = marketRepository.findById(marketId);
        if (marketOpt.isEmpty()) return null;
        
        Market market = marketOpt.get();
        Map<String, Object> map2D = market.getMap2D();
        
        // Ensure stalls list exists and is mutable
        List<Map<String, Object>> stalls;
        if (map2D.get("stalls") instanceof List) {
            stalls = new ArrayList<>((List<Map<String, Object>>) map2D.get("stalls"));
        } else {
            stalls = new ArrayList<>();
        }
        
        stalls.add(new HashMap<>(stallData));
        
        // Update map2D
        Map<String, Object> updatedMap2D = new HashMap<>(map2D);
        updatedMap2D.put("stalls", stalls);
        market.setMap2D(updatedMap2D);
        
        marketRepository.save(market);
        return stallData;
    }

    public boolean removeStallFromMarket(String marketId, String stallId) {
        Optional<Market> marketOpt = marketRepository.findById(marketId);
        if (marketOpt.isEmpty()) return false;
        
        Market market = marketOpt.get();
        Map<String, Object> map2D = market.getMap2D();
        
        List<Map<String, Object>> stalls;
        if (map2D.get("stalls") instanceof List) {
            stalls = new ArrayList<>((List<Map<String, Object>>) map2D.get("stalls"));
        } else {
            return false;
        }
        
        boolean removed = stalls.removeIf(s -> s.get("id").equals(stallId));
        if (removed) {
            Map<String, Object> updatedMap2D = new HashMap<>(map2D);
            updatedMap2D.put("stalls", stalls);
            market.setMap2D(updatedMap2D);
            marketRepository.save(market);
        }
        
        return removed;
    }

    private Map<String, Object> convertToMap(Market market) {
        return objectMapper.convertValue(market, Map.class);
    }

    private Market convertToEntity(Map<String, Object> map) {
        return objectMapper.convertValue(map, Market.class);
    }
}

