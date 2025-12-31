package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Primary Key

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Recipient of the notification

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ip_asset_id")
    private IPAsset ipAsset; // Associated IP asset

    @Column(columnDefinition = "TEXT")
    private String message; // The notification text

    @Column(length = 50)
    private String type; // Type of alert (e.g., 'Status Update', 'Expiry')

    private LocalDateTime timestamp; // When the notification was sent

    @PrePersist
    protected void onSend() {
        timestamp = LocalDateTime.now();
    }
}