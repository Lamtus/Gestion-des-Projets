package com.example.gestionprojet.web.dto;

import lombok.Data;
import java.util.Date;
import java.util.Set;
import java.util.List;

@Data
public class UpdateTacheRequest {
    private String titre;
    private String description;
    private Date dateDebut;
    private Date dateFin;
    private String statut;
    private String priorite;
    private Set<Long> predecesseursIds;
    private List<String> tags;
} 