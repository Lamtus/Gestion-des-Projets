package com.example.gestionprojet.business.service;
 
public interface EmailService {
    void sendInvitationEmail(String to, String nom, String prenom);
} 