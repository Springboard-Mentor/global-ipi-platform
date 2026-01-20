package com.example.demo.subscription.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscription_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String userName;

    private String oldPlan;

    private String newPlan;

    private Double amount;

    private String action; // e.g., "UPGRADED", "DOWNGRADED", "NEW"

    @CreationTimestamp
    private LocalDateTime createdAt;
}
