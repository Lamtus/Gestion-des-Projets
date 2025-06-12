package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Affectation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAffectation;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @ManyToOne
    @JoinColumn(name = "id_tache")
    private Tache tache;

    @ManyToOne
    @JoinColumn(name = "id_membre")
    private User membre;
} 