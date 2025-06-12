package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Chef {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chef")
    private Long idChef;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @ManyToOne
    @JoinColumn(name = "id_chef_projet")
    private User chef;
} 