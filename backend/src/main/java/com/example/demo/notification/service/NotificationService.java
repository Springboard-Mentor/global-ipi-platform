package com.example.demo.notification.service;

import com.example.demo.notification.dto.NotificationRequest;
import com.example.demo.notification.dto.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    NotificationResponse create(NotificationRequest request);
    /**
     * Create a notification for a single user or broadcast to all subscribers when ipAssetId is set.
     */
    NotificationResponse createAndBroadcast(NotificationRequest request);

    Page<NotificationResponse> listForUser(Long userId, Pageable pageable, boolean onlyUnread);
    void markAsRead(Long notificationId, Long userId);
}
