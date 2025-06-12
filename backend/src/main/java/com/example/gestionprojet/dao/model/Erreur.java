package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Erreur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idErreur;

    private String message;

    @ManyToOne
    @JoinColumn(name = "id_membre")
    private User membre;

    @ManyToOne
    @JoinColumn(name = "id_tache")
    private Tache tache;
} 