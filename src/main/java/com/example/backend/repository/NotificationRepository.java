package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
