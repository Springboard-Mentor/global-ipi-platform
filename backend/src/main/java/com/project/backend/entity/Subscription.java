package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Primary Key

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Foreign key link to User entity

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ip_asset_id", nullable = false)
    private IPAsset ipAsset; // Foreign key link to IPAsset entity

    @Column(name = "created_at")
    private LocalDateTime createdAt; // Timestamp of subscription

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}