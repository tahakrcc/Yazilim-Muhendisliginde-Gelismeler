package com.pazar.backend.controller;

import com.pazar.backend.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/markets")
@CrossOrigin(origins = {"http://localhost:5173", "http://frontend:3000"})
@Tag(name = "Markets", description = "Marketplace management and location APIs")
public class MarketController {

    @Autowired
    private MarketService marketService;

    @Operation(summary = "Get All Markets", description = "List all marketplaces")
    @GetMapping
    public ResponseEntity<?> getAllMarkets() {
        return ResponseEntity.ok(marketService.getAllMarkets());
    }

    @Operation(summary = "Get Market by ID", description = "Get detailed information about a specific market")
    @GetMapping("/{marketId}")
    public ResponseEntity<Map<String, Object>> getMarket(@PathVariable String marketId) {
        Map<String, Object> market = marketService.getMarketById(marketId);
        if (market == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(market);
    }

    @Operation(summary = "Get Market Map", description = "Get 2D and 3D map information for a market")
    @GetMapping("/{marketId}/map")
    public ResponseEntity<Map<String, Object>> getMarketMap(@PathVariable String marketId) {
        Map<String, Object> map = marketService.getMarketMap(marketId);
        if (map == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(map);
    }

    @Operation(summary = "Get Route to Stall", description = "Get navigation route to a specific stall in the market")
    @GetMapping("/{marketId}/route/{stallNumber}")
    public ResponseEntity<Map<String, Object>> getRoute(
            @PathVariable String marketId,
            @PathVariable String stallNumber) {
        
        Map<String, Object> route = marketService.getRoute(marketId, stallNumber);
        if (route == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(route);
    }
}

