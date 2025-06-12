package com.example.gestionprojet.web.controller;

import com.example.gestionprojet.business.service.ProjetLogService;
import com.example.gestionprojet.dao.model.ProjetLog;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets/logs")
@RequiredArgsConstructor
public class ProjetLogController {
    private final ProjetLogService projetLogService;

    @GetMapping("/{idProjet}")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'MEMBRE_EQUIPE')")
    public ResponseEntity<List<ProjetLog>> getLogsByProjet(@PathVariable Long idProjet) {
        return ResponseEntity.ok(projetLogService.getLogsByProjet(idProjet));
    }
} 