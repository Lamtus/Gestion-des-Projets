package com.example.gestionprojet.business.service;

import com.example.gestionprojet.web.dto.AuthResponse;
import com.example.gestionprojet.web.dto.LoginRequest;
import com.example.gestionprojet.web.dto.RegisterRequest;

public interface AuthService {
    /**
     * Enregistre un nouvel utilisateur
     * @param request Les informations d'inscription
     * @return La réponse d'authentification
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authentifie un utilisateur existant
     * @param request Les informations de connexion
     * @return La réponse d'authentification contenant le token JWT
     */
    AuthResponse login(LoginRequest request);

    /**
     * Change le mot de passe d'un utilisateur
     * @param email L'email de l'utilisateur
     * @param newPassword Le nouveau mot de passe
     */
    AuthResponse changePassword(String email, String newPassword);
} 