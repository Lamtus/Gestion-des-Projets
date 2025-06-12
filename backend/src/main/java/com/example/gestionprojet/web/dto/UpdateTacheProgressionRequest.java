package com.example.gestionprojet.web.dto;

import lombok.Data;

@Data
public class UpdateTacheProgressionRequest {
    private Integer progression; // Valeur entre 0 et 100
} 