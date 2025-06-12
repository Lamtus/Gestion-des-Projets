package com.example.gestionprojet.web.controller;

import com.example.gestionprojet.business.service.NotificationService;
import com.example.gestionprojet.dao.model.Notification;
import com.example.gestionprojet.dao.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/mes-notifications")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTEUR', 'MEMBRE_EQUIPE')")
    public ResponseEntity<List<Notification>> getMesNotifications(@AuthenticationPrincipal User user) {
        List<Notification> notifications = notificationService.getNotificationsByUser(user);
        return ResponseEntity.ok(notifications);
    }
} 