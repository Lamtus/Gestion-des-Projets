package com.example.gestionprojet.dao.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tache_logs")
public class TacheLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLog;

    @ManyToOne
    @JoinColumn(name = "id_tache")
    private Tache tache;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();
} 