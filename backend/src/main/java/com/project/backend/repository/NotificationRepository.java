package com.project.backend.repository;

import com.project.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    // Fetch notifications for a user, ordered by most recent
    List<Notification> findByUserIdOrderByTimestampDesc(Integer userId);
}