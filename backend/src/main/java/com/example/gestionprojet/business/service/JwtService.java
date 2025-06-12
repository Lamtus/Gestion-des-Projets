package com.example.gestionprojet.business.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.example.gestionprojet.dao.model.User;

public interface JwtService {
    /**
     * Extrait le nom d'utilisateur (email) du token JWT
     * @param token Le token JWT
     * @return L'email de l'utilisateur
     */
    String extractUsername(String token);

    /**
     * Génère un token JWT pour un utilisateur
     * @param user L'utilisateur pour lequel générer le token
     * @return Le token JWT généré
     */
    String generateToken(User user);

    /**
     * Vérifie si un token JWT est valide pour un utilisateur
     * @param token Le token JWT à vérifier
     * @param userDetails Les détails de l'utilisateur
     * @return true si le token est valide, false sinon
     */
    boolean isTokenValid(String token, UserDetails userDetails);
} 