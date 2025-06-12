package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender emailSender;
    private static final String DEFAULT_PASSWORD = "Passw0rd@";

    @Override
    public void sendInvitationEmail(String to, String nom, String prenom) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Invitation à rejoindre GestionProjet");
        message.setText("Bonjour " + prenom + " " + nom + ",\n\n" +
                "Vous avez été invité à rejoindre l'application GestionProjet.\n" +
                "Veuillez vous connecter avec votre email et le mot de passe temporaire suivant : " + DEFAULT_PASSWORD + "\n\n" +
                "Pour des raisons de sécurité, vous devrez changer votre mot de passe lors de votre première connexion.\n\n" +
                "Cordialement,\n" +
                "L'équipe GestionProjet");
        
        emailSender.send(message);
    }
} 