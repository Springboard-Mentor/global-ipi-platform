package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.example.backend.enums.NotificationType;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Notification belongs to a user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Notification related to an IP asset
    @ManyToOne
    @JoinColumn(name = "ip_asset_id", nullable = false)
    private IPAsset ipAsset;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private LocalDateTime timestamp = LocalDateTime.now();
}
