package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many subscriptions can belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many subscriptions can belong to one IP asset
    @ManyToOne
    @JoinColumn(name = "ip_asset_id", nullable = false)
    private IPAsset ipAsset;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}

