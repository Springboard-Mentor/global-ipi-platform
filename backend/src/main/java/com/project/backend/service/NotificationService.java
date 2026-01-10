package com.project.backend.service;

import com.project.backend.entity.Notification;
import com.project.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getUserNotifications(Integer userId) {
        // Fetch most recent alerts first
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public void sendAlert(Integer userId, Integer assetId, String message, String type) {
        Notification note = new Notification();
        // Logic to link User and IPAsset entities here
        note.setMessage(message);
        note.setType(type);
        notificationRepository.save(note);
    }
}