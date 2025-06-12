package com.example.gestionprojet.business.service;

import com.example.gestionprojet.dao.model.Notification;
import com.example.gestionprojet.dao.model.User;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsByUser(User user);
    void createNotification(User user, String message);
} 