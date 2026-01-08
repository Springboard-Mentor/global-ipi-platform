package com.project.backend.repository;

import com.project.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    
    // ✅ Uses 'UserId' to navigate the Notification -> User -> id relationship
    // Accepts Integer as per your requirement
    List<Notification> findByUserIdOrderByTimestampDesc(Integer userId);
}