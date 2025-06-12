package com.example.gestionprojet.web.dto;

import lombok.Data;
import java.util.Date;

@Data
public class UpdateProjetRequest {
    private String titre;
    private String description;
    private String statut;
    private Date dateDebut;
    private Date dateFin;
} 