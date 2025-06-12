package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "projet_logs")
public class ProjetLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLog;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();
} 