package com.example.gestionprojet.web.controller;

import com.example.gestionprojet.business.service.AuthService;
import com.example.gestionprojet.web.dto.AuthResponse;
import com.example.gestionprojet.web.dto.LoginRequest;
import com.example.gestionprojet.web.dto.RegisterRequest;
import com.example.gestionprojet.web.dto.ChangePasswordRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.gestionprojet.dao.model.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok().body("Mot de passe modifié avec succès");
    }
} 