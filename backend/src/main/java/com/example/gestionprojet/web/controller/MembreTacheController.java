package com.example.gestionprojet.web.controller;

import com.example.gestionprojet.business.service.TacheService;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.web.dto.TacheResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/taches")
@RequiredArgsConstructor
public class MembreTacheController {

    private final TacheService tacheService;

    @GetMapping("/assignee/{userId}")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'CHEF_PROJET', 'MEMBRE_EQUIPE') and (#userId == authentication.principal.id or hasAnyRole('DIRECTEUR', 'CHEF_PROJET'))")
    public ResponseEntity<List<TacheResponseDto>> getTachesByMembre(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser
    ) {
        // If the current user is a simple MEMBRE_EQUIPE, ensure they can only view their own tasks
        if (currentUser.getRole().equals("MEMBRE_EQUIPE") && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        List<TacheResponseDto> taches = tacheService.getTachesByMembre(userId);
        return ResponseEntity.ok(taches);
    }
} 