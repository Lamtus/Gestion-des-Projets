package com.example.gestionprojet.web.dto;

import lombok.Data;
import java.util.Date;

@Data
public class UpdateTacheRequest {
    private String titre;
    private String description;
    private Date dateDebut;
    private Date dateFin;
    private String statut;
} 