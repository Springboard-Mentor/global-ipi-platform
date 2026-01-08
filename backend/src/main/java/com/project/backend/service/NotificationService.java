package com.project.backend.service;

import com.project.backend.entity.Notification;
import com.project.backend.entity.User;
import com.project.backend.entity.IPAsset;
import com.project.backend.repository.NotificationRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.repository.IPAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notificationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private IPAssetRepository ipAssetRepository;

    // ✅ CREATE: Helper method for object-based creation
    public void createNotification(User user, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);
    }

    // ✅ GET: Accepts Integer to match your structure
    public List<Notification> getUserNotifications(Integer userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    // ✅ SEND ALERT: Accepts Integers, converts to Long for User lookup
    @Transactional
    public void sendAlert(Integer userId, Integer assetId, String message, String type) {
        // Convert Integer userId to Long to match UserRepository expectations
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        // Fetch Asset (matches IPAssetRepository <IPAsset, Integer>)
        IPAsset asset = (assetId != null) ? ipAssetRepository.findById(assetId).orElse(null) : null;

        Notification note = new Notification();
        note.setUser(user);
        note.setIpAsset(asset);
        note.setMessage(message);
        note.setType(type);
        
        notificationRepository.save(note);
    }
}