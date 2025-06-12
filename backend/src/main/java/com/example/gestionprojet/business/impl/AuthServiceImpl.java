package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.AuthService;
import com.example.gestionprojet.business.service.EmailService;
import com.example.gestionprojet.business.service.JwtService;
import com.example.gestionprojet.dao.model.Role;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.dao.repository.UserRepository;
import com.example.gestionprojet.exception.BusinessException;
import com.example.gestionprojet.web.dto.AuthResponse;
import com.example.gestionprojet.web.dto.LoginRequest;
import com.example.gestionprojet.web.dto.RegisterRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    private static final String DEFAULT_PASSWORD = "Passw0rd@";

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Un utilisateur avec cet email existe déjà");
        }

        // Vérifier si c'est le premier utilisateur (premier admin)
        boolean isFirstUser = userRepository.count() == 0;
        
        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(isFirstUser ? request.getPassword() : DEFAULT_PASSWORD))
                .telephone(request.getTelephone())
                .poste(request.getPoste())
                .departement(request.getDepartement())
                .role(isFirstUser ? Role.ADMIN : (request.getRole() != null ? request.getRole() : Role.MEMBRE_EQUIPE))
                .firstLogin(!isFirstUser) // false pour le premier admin, true pour les autres
                .build();

        userRepository.save(user);
        
        // Envoyer l'email d'invitation seulement si ce n'est pas le premier admin
        if (!isFirstUser) {
            emailService.sendInvitationEmail(user.getEmail(), user.getNom(), user.getPrenom());
        }
        
        return AuthResponse.builder()
                .message("Inscription réussie")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new BusinessException("Email ou mot de passe incorrect");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));
        
        String token = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(token)
                .message("Connexion réussie")
                .firstLogin(user.isFirstLogin())
                .build();
    }

    @Override
    @Transactional
    public void changePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFirstLogin(false);
        userRepository.save(user);
    }
} 