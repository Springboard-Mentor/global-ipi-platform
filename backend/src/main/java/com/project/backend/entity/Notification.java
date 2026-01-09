package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // ✅ IMPORT THIS

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    // ✅ FIX: Ignore the proxy fields causing the 500 error
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "role"}) 
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ip_asset_id")
    // ✅ FIX: Ignore proxy fields here too
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private IPAsset ipAsset;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(length = 50)
    private String type;

    @Column(name = "is_read")
    private Boolean isRead = false; 

    private LocalDateTime timestamp;

    @PrePersist
    protected void onSend() {
        timestamp = LocalDateTime.now();
        if (isRead == null) isRead = false;
    }
}