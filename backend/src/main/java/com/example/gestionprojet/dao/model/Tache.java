package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;

@Data
@Entity
@Table(name = "taches")
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
    private String priorite;

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

    @ManyToOne
    @JoinColumn(name = "id_assigne")
    private User assigne;

    @ElementCollection
    @CollectionTable(name = "tache_tags", joinColumns = @JoinColumn(name = "tache_id"))
    @Column(name = "tag_name")
    private List<String> tags = new ArrayList<>();
} 