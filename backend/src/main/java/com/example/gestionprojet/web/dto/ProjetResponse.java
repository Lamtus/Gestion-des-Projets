package com.example.gestionprojet.web.dto;

import com.example.gestionprojet.dao.model.User;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class ProjetResponse {
    private Long idProjet;
    private String titre;
    private String description;
    private String statut;
    private Date dateDebut;
    private Date dateFin;
    private User directeur;
    private User chefProjet; // Added for project manager
} 