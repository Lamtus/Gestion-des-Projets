package com.example.gestionprojet.dao.repository;

import com.example.gestionprojet.dao.model.Notification;
import com.example.gestionprojet.dao.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByMembreOrderByIdNotificationDesc(User membre);
} 