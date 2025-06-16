package com.example.gestionprojet.web.dto;

import com.example.gestionprojet.dao.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserWithProjectCountDto {
    private Long id;
    private String nom;
    private String prenom;
    private String poste;
    private String departement;
    private Role role;
    private int numberOfProjectsLed;
    private int charge;
    private String availability;
} 