package com.example.gestionprojet.web.dto;

import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TacheResponseDto {
    private Long idTache;
    private String titre;
    private String description;
    private Date dateDebut;
    private Date dateFin;
    private String statut;
    private Integer progression;
    private String priorite;
    private Projet projet;
    private User assigne;
    private Set<Long> predecesseursIds;
    private List<String> tags;

    public static TacheResponseDto fromEntity(Tache tache, User assigne) {
        return TacheResponseDto.builder()
                .idTache(tache.getIdTache())
                .titre(tache.getTitre())
                .description(tache.getDescription())
                .dateDebut(tache.getDateDebut())
                .dateFin(tache.getDateFin())
                .statut(tache.getStatut())
                .progression(tache.getProgression())
                .priorite(tache.getPriorite())
                .projet(tache.getProjet())
                .assigne(assigne)
                .predecesseursIds(tache.getPredecesseurs() != null ?
                        tache.getPredecesseurs().stream().map(Tache::getIdTache).collect(Collectors.toSet()) : null)
                .tags(tache.getTags())
                .build();
    }
} 