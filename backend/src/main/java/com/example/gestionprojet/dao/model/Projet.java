package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProjet;

    private String titre;
    private String description;
    private String statut;

    @Temporal(TemporalType.DATE)
    private Date dateDebut;

    @Temporal(TemporalType.DATE)
    private Date dateFin;

    private Double budget;
    private String category;
    private String priority;

    @ManyToOne
    @JoinColumn(name = "id_directeur")
    private User directeur;
}
