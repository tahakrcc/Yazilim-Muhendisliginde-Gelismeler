package com.pazar.backend.controller;

import com.pazar.backend.dto.LoginRequest;
import com.pazar.backend.dto.LoginResponse;
import com.pazar.backend.dto.RefreshTokenRequest;
import com.pazar.backend.entity.User;
import com.pazar.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
@Tag(name = "Authentication", description = "User authentication APIs")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Operation(summary = "User Login", description = "Login with email and password")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login request received: " + request.getEmail());
            LoginResponse response = authService.login(request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                new LoginResponse(null, null, null, null, null, null, null, null, false)
            );
        }
    }

    @Operation(summary = "User Registration", description = "Create new user account")
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody User user) {
        try {
            System.out.println("Register request received: " + user.getEmail());
            LoginResponse response = authService.register(user);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(400).body(response);
            }
        } catch (Exception e) {
            System.err.println("Register error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                new LoginResponse(null, null, null, null, null, null, null, null, false)
            );
        }
    }
    
    @Operation(summary = "Refresh Token", description = "Get new access token using refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            LoginResponse response = authService.refreshToken(request.getRefreshToken());
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            System.err.println("Refresh token error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                new LoginResponse(null, null, null, null, null, null, null, null, false)
            );
        }
    }
}

