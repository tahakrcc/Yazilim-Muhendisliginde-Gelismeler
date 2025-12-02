package com.pazar.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/markets")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
@Tag(name = "Markets", description = "Marketplace management and location APIs")
public class MarketController {

    // Mock database
    private static final Map<String, Map<String, Object>> markets_db = new ConcurrentHashMap<>();

    static {
        // Demo pazarlar
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

    @Operation(summary = "Get All Markets", description = "List all marketplaces")
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllMarkets() {
        return ResponseEntity.ok(new ArrayList<>(markets_db.values()));
    }

    @Operation(summary = "Get Market by ID", description = "Get detailed information about a specific market")
    @GetMapping("/{marketId}")
    public ResponseEntity<Map<String, Object>> getMarket(@PathVariable String marketId) {
        if (!markets_db.containsKey(marketId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(markets_db.get(marketId));
    }

    @Operation(summary = "Get Market Map", description = "Get 2D and 3D map information for a market")
    @GetMapping("/{marketId}/map")
    public ResponseEntity<Map<String, Object>> getMarketMap(@PathVariable String marketId) {
        if (!markets_db.containsKey(marketId)) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> market = markets_db.get(marketId);
        Map<String, Object> response = new HashMap<>();
        response.put("marketId", marketId);
        response.put("marketName", market.get("name"));
        response.put("map2D", market.get("map2D"));
        response.put("map3D", market.get("map3D"));
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get Route to Stall", description = "Get navigation route to a specific stall in the market")
    @GetMapping("/{marketId}/route/{stallNumber}")
    public ResponseEntity<Map<String, Object>> getRoute(
            @PathVariable String marketId,
            @PathVariable String stallNumber) {
        
        if (!markets_db.containsKey(marketId)) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> market = (Map<String, Object>) markets_db.get(marketId);
        Map<String, Object> map2D = (Map<String, Object>) market.get("map2D");
        List<Map<String, Object>> stalls = (List<Map<String, Object>>) map2D.get("stalls");

        Optional<Map<String, Object>> stallOpt = stalls.stream()
            .filter(s -> s.get("id").equals(stallNumber))
            .findFirst();

        if (stallOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

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

        return ResponseEntity.ok(response);
    }
}

