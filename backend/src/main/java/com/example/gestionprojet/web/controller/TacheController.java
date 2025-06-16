package com.example.gestionprojet.web.controller;

import com.example.gestionprojet.business.service.TacheService;
import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.web.dto.CreateTacheRequest;
import com.example.gestionprojet.web.dto.UpdateTacheRequest;
import com.example.gestionprojet.web.dto.UpdateTacheStatutRequest;
import com.example.gestionprojet.web.dto.UpdateTacheProgressionRequest;
import com.example.gestionprojet.web.dto.TacheResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets/{idProjet}/taches")
@RequiredArgsConstructor
public class TacheController {
    private final TacheService tacheService;

    @GetMapping
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'MEMBRE_EQUIPE')")
    public ResponseEntity<List<TacheResponseDto>> getTachesByProjet(@PathVariable Long idProjet) {
        List<TacheResponseDto> taches = tacheService.getTachesByProjet(idProjet);
        return ResponseEntity.ok(taches);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'MEMBRE_EQUIPE')")
    public ResponseEntity<?> createTache(
            @PathVariable Long idProjet,
            @RequestBody CreateTacheRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Tache tache = tacheService.createTache(idProjet, request, user);
            return ResponseEntity.ok(tache);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping("/{idTache}")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'MEMBRE_EQUIPE')")
    public ResponseEntity<?> updateTache(
            @PathVariable Long idTache,
            @RequestBody UpdateTacheRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Tache tache = tacheService.updateTache(idTache, request, user);
            return ResponseEntity.ok(tache);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PatchMapping("/{idTache}/statut")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'MEMBRE_EQUIPE')")
    public ResponseEntity<?> updateTacheStatut(
            @PathVariable Long idTache,
            @RequestBody UpdateTacheStatutRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Tache tache = tacheService.updateTacheStatut(idTache, request, user);
            return ResponseEntity.ok(tache);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PatchMapping("/{idTache}/progression")
    public ResponseEntity<?> updateTacheProgression(
            @PathVariable Long idTache,
            @RequestBody UpdateTacheProgressionRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Tache tache = tacheService.updateTacheProgression(idTache, request, user);
            return ResponseEntity.ok(tache);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
} 