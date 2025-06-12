package com.example.gestionprojet.web.controller;

import com.example.gestionprojet.business.service.AffectationService;
import com.example.gestionprojet.dao.model.Affectation;
import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.web.dto.AffectationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/taches")
@RequiredArgsConstructor
public class AffectationController {
    private final AffectationService affectationService;

    @PostMapping("/{idTache}/affectations")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<?> affecterTache(
            @PathVariable Long idTache,
            @RequestBody AffectationRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Affectation affectation = affectationService.affecterTache(idTache, request.getIdMembre(), user);
            return ResponseEntity.ok(affectation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/mes-taches")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'MEMBRE_EQUIPE')")
    public ResponseEntity<List<Tache>> getMesTaches(@AuthenticationPrincipal User user) {
        List<Tache> taches = affectationService.getTachesByMembre(user);
        return ResponseEntity.ok(taches);
    }
} 