package com.pazar.backend.controller;

import com.pazar.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://frontend:3000"})
@Tag(name = "Authentication", description = "User authentication APIs")
public class AuthController {
    
    @Autowired
    private JwtService jwtService;
    
    @Operation(summary = "User Login", description = "Login with email and password")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            // Basit mock authentication - gerçek uygulamada database'den kontrol edilir
            String role = "USER";
            if ("admin@pazar.com".equals(email) && "123456".equals(password)) {
                role = "ADMIN";
            } else if ("user@pazar.com".equals(email) && "123456".equals(password)) {
                role = "USER";
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Invalid credentials");
                return ResponseEntity.status(401).body(error);
            }
            
            // JWT token oluştur
            String token = jwtService.generateToken(email, role);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("email", email);
            response.put("role", role);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Login error: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @Operation(summary = "User Registration", description = "Create new user account")
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> user) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("userId", "user_" + System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Registration error: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}

