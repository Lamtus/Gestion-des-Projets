package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.NotificationService;
import com.example.gestionprojet.dao.model.Notification;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.dao.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    @Override
    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByMembreOrderByIdNotificationDesc(user);
    }

    @Override
    @Transactional
    public void createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setMembre(user);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
} 