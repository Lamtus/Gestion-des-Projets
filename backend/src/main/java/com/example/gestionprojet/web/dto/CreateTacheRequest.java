package com.example.gestionprojet.web.dto;

import lombok.Data;
import java.util.Date;
import java.util.Set;

@Data
public class CreateTacheRequest {
    private String titre;
    private String description;
    private Date dateDebut;
    private Date dateFin;
    private String statut;
    private Integer progression;
    private Set<Long> predecesseursIds;
} 