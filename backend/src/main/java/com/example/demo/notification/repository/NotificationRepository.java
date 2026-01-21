package com.example.demo.notification.repository;

import com.example.demo.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);
    Page<Notification> findByUserIdAndReadFalseOrderByTimestampDesc(Long userId, Pageable pageable);
    void deleteByUserId(Long userId);
}
