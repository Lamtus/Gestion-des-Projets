package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.Set;

@Data
@Entity
public class Tache {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTache;

    private String titre;
    private String description;
    private Date dateDebut;
    private Date dateFin;
    private String statut;
    private Integer progression;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @ManyToMany
    @JoinTable(
        name = "tache_predecesseurs",
        joinColumns = @JoinColumn(name = "id_tache"),
        inverseJoinColumns = @JoinColumn(name = "id_predecesseur")
    )
    private Set<Tache> predecesseurs;
} 