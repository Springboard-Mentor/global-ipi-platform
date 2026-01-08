package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "filing_tracker")
@Data
public class FilingTracker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "ip_asset_id", nullable = false)
    private IPAsset ipAsset;

    private String status;
    private LocalDateTime trackedAt;

    @PrePersist
    protected void onCreate() {
        this.trackedAt = LocalDateTime.now();
    }
}