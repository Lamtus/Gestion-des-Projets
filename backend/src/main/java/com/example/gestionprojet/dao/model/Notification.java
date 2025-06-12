package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNotification;

    private String message;

    @ManyToOne
    @JoinColumn(name = "id_membre")
    private User membre;
} 