package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Commentaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommentaire;

    private String contenu;

    @ManyToOne
    @JoinColumn(name = "id_membre")
    private User membre;

    @ManyToOne
    @JoinColumn(name = "id_tache")
    private Tache tache;
} 