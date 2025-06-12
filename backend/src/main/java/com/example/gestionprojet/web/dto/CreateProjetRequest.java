package com.example.gestionprojet.web.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CreateProjetRequest {
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
    private String status;
    private Long managerId;
    private Double budget;
    private String category;
    private String priority;
    private Long idDirecteur;
}
