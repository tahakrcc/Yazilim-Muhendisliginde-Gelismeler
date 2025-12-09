package com.pazar.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MarketService {

    private static final Map<String, Map<String, Object>> markets_db = new ConcurrentHashMap<>();

    static {
        initializeDemoData();
    }

    private static void initializeDemoData() {
        Map<String, Object> market1 = new HashMap<>();
        market1.put("id", "market_1");
        market1.put("name", "Merkez Pazar");
        market1.put("address", "İstanbul, Kadıköy");
        market1.put("latitude", 40.9884);
        market1.put("longitude", 29.0232);
        market1.put("isOpenToday", true);
        market1.put("openingHours", "08:00 - 20:00");
        market1.put("map2D", Map.of(
            "width", 400,
            "height", 300,
            "stalls", Arrays.asList(
                Map.of("id", "A-12", "x", 120, "y", 80, "z", 0, "type", "Sebze"),
                Map.of("id", "B-05", "x", 250, "y", 150, "z", 0, "type", "Sebze"),
                Map.of("id", "A-08", "x", 80, "y", 60, "z", 0, "type", "Sebze")
            )
        ));
        market1.put("map3D", Map.of(
            "enabled", true,
            "floorCount", 2,
            "currentFloor", 0
        ));
        markets_db.put("market_1", market1);

        Map<String, Object> market2 = new HashMap<>();
        market2.put("id", "market_2");
        market2.put("name", "Şişli Pazarı");
        market2.put("address", "İstanbul, Şişli");
        market2.put("latitude", 41.0600);
        market2.put("longitude", 28.9870);
        market2.put("isOpenToday", true);
        market2.put("openingHours", "07:00 - 19:00");
        market2.put("map2D", Map.of(
            "width", 500,
            "height", 400,
            "stalls", Arrays.asList()
        ));
        market2.put("map3D", Map.of(
            "enabled", true,
            "floorCount", 1,
            "currentFloor", 0
        ));
        markets_db.put("market_2", market2);
    }

    public List<Map<String, Object>> getAllMarkets() {
        return new ArrayList<>(markets_db.values());
    }

    public Map<String, Object> getMarketById(String marketId) {
        return markets_db.get(marketId);
    }

    public Map<String, Object> getMarketMap(String marketId) {
        Map<String, Object> market = markets_db.get(marketId);
        if (market == null) return null;

        Map<String, Object> response = new HashMap<>();
        response.put("marketId", marketId);
        response.put("marketName", market.get("name"));
        response.put("map2D", market.get("map2D"));
        response.put("map3D", market.get("map3D"));
        
        return response;
    }

    public Map<String, Object> getRoute(String marketId, String stallNumber) {
        Map<String, Object> market = markets_db.get(marketId);
        if (market == null) return null;

        Map<String, Object> map2D = (Map<String, Object>) market.get("map2D");
        List<Map<String, Object>> stalls = (List<Map<String, Object>>) map2D.get("stalls");

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
            "z", stall.get("z")
        ));
        response.put("directions", "Pazar girişinden " + stallNumber + " numaralı tezgaha yürüyün. Konum: X=" + 
                     stall.get("x") + ", Y=" + stall.get("y"));
        response.put("estimatedTime", "2-3 dakika");

        return response;
    }

    // Admin CRUD operations
    public Map<String, Object> createMarket(Map<String, Object> marketData) {
        String id = "market_" + System.currentTimeMillis();
        Map<String, Object> market = new HashMap<>(marketData);
        market.put("id", id);
        
        // Default map structure if not provided
        if (!market.containsKey("map2D")) {
            market.put("map2D", Map.of(
                "width", 400,
                "height", 300,
                "stalls", new ArrayList<>()
            ));
        }
        if (!market.containsKey("map3D")) {
            market.put("map3D", Map.of(
                "enabled", true,
                "floorCount", 1,
                "currentFloor", 0
            ));
        }
        
        markets_db.put(id, market);
        return market;
    }

    public Map<String, Object> updateMarket(String marketId, Map<String, Object> marketData) {
        Map<String, Object> existing = markets_db.get(marketId);
        if (existing == null) return null;
        
        Map<String, Object> updated = new HashMap<>(existing);
        updated.putAll(marketData);
        updated.put("id", marketId); // ID değiştirilemez
        markets_db.put(marketId, updated);
        return updated;
    }

    public boolean deleteMarket(String marketId) {
        return markets_db.remove(marketId) != null;
    }

    public Map<String, Object> addStallToMarket(String marketId, Map<String, Object> stallData) {
        Map<String, Object> market = markets_db.get(marketId);
        if (market == null) return null;
        
        Map<String, Object> map2D = (Map<String, Object>) market.get("map2D");
        List<Map<String, Object>> stalls = new ArrayList<>((List<Map<String, Object>>) map2D.get("stalls"));
        stalls.add(new HashMap<>(stallData));
        
        Map<String, Object> updatedMap2D = new HashMap<>(map2D);
        updatedMap2D.put("stalls", stalls);
        market.put("map2D", updatedMap2D);
        
        return stallData;
    }

    public boolean removeStallFromMarket(String marketId, String stallId) {
        Map<String, Object> market = markets_db.get(marketId);
        if (market == null) return false;
        
        Map<String, Object> map2D = (Map<String, Object>) market.get("map2D");
        List<Map<String, Object>> stalls = new ArrayList<>((List<Map<String, Object>>) map2D.get("stalls"));
        
        boolean removed = stalls.removeIf(s -> s.get("id").equals(stallId));
        if (removed) {
            Map<String, Object> updatedMap2D = new HashMap<>(map2D);
            updatedMap2D.put("stalls", stalls);
            market.put("map2D", updatedMap2D);
        }
        
        return removed;
    }
}

