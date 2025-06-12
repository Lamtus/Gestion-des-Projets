package com.example.gestionprojet.web.controller;

import com.example.gestionprojet.business.service.ProjetService;
import com.example.gestionprojet.web.dto.CreateProjetRequest;
import com.example.gestionprojet.web.dto.UpdateProjetRequest;
import com.example.gestionprojet.web.dto.ChangeChefProjetRequest;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.web.dto.ProjetResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@RequiredArgsConstructor
public class ProjetController {

    private final ProjetService projetService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'MEMBRE_EQUIPE')")
    public ResponseEntity<?> getProjetById(@PathVariable Long id) {
        try {
            Projet projet = projetService.getProjetById(id);
            return ResponseEntity.ok(projet);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<?> addProjet(
            @AuthenticationPrincipal User user,
            @RequestBody CreateProjetRequest request
    ) {
        try {
            Projet projet = projetService.addProjet(request, user);
            return ResponseEntity.ok(projet);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<?> updateProjet(
            @PathVariable Long id,
            @RequestBody UpdateProjetRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Projet projet = projetService.updateProjet(id, request, user);
            return ResponseEntity.ok(projet);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/chef")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<?> changeChefProjet(
            @PathVariable Long id,
            @RequestBody ChangeChefProjetRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Projet projet = projetService.changeChefProjet(id, request, user);
            return ResponseEntity.ok(projet);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/directeur")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<List<ProjetResponse>> getProjetsByDirecteur(@AuthenticationPrincipal User user) {
        List<ProjetResponse> projets = projetService.getProjetsByDirecteur(user);
        return ResponseEntity.ok(projets);
    }
}
